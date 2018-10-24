#include <ESP8266WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"
#include "SPI.h"
#include "PN532_SPI.h"
#include "snep.h"
#include "NdefMessage.h"
#include <Servo.h>

/************************* WiFi Access Point *********************************/

#define WLAN_SSID       "Playroom"
#define WLAN_PASS       "Jaramillo2012"

/************************* Adafruit.io Setup *********************************/

#define AIO_SERVER      "io.adafruit.com"
#define AIO_SERVERPORT  1883                   // use 8883 for SSL
#define AIO_USERNAME    "CloudlockTeam"
#define AIO_KEY         "17d40238f10342fdb884cf02a62db208"

/************************** Global State ************************************/

// Creates an ESP8266 WiFiClient class to connect to the MQTT server.
WiFiClient client;

// Setups the MQTT client class by passing in the WiFi client and MQTT server and login details.
Adafruit_MQTT_Client mqtt(&client, AIO_SERVER, AIO_SERVERPORT, AIO_USERNAME, AIO_KEY);

/****************************** Feeds ***************************************/

// Subscribes to feed to see the state of the door.
Adafruit_MQTT_Subscribe doorState = Adafruit_MQTT_Subscribe(&mqtt, AIO_USERNAME "/feeds/Door");

// Setups publishing Current IMEI.
Adafruit_MQTT_Publish Imei = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/IMEI");

//Subscribes to feed to see IMEI cheking Status.
Adafruit_MQTT_Subscribe imeiStatus = Adafruit_MQTT_Subscribe(&mqtt, AIO_USERNAME "/feeds/Status");

String DOOR = "D0";
uint8_t IMEI = 0;
String NewStatus = "S0";

/*************************** Sketch Code ************************************/

String userImei = "0";
PN532_SPI pn532spi(SPI, 5);
SNEP nfc(pn532spi);
uint8_t ndefBuf[128];
Servo myservo;
int servo = 15;
int ledR = 4;
int ledB = 0;
int ledG = 2;

void MQTT_connect();

void setup() {
  Serial.begin(9600);
  delay(10);

  //Setup Servo and leds.
  myservo.attach(servo);
  pinMode(ledR, OUTPUT);
  pinMode(ledB, OUTPUT);
  pinMode(ledG, OUTPUT);
  
  // Connect to WiFi access point.
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WLAN_SSID);

  WiFi.begin(WLAN_SSID, WLAN_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Setup MQTT subscription for feeds.
  mqtt.subscribe(&doorState);
  mqtt.subscribe(&imeiStatus);

}

void loop() {
  MQTT_connect();
  getMsgFromAndroid();
  // this is our 'wait for incoming subscription packets' busy subloop
  // try to spend your time here

  Adafruit_MQTT_Subscribe *subscription;
  //Checks value of subscribed feeds.
  while ((subscription = mqtt.readSubscription(5000))) {
    //Checks value of doorState feed.
    if (subscription == &doorState) {
      Serial.print(F("Last Door State value: "));
      DOOR = (char *)doorState.lastread;
      Serial.println(DOOR);
      if (DOOR == "D1") {
        accessGranted();
      }
      else if (DOOR == "D0") {
        accessDenied();
      }
      else {
        error();
      }
    }
    //Checks value of imeiStatus feed.
    if (subscription == &imeiStatus) {
      Serial.print(F("Last Imei Checking Status value: "));
      NewStatus = (char *)imeiStatus.lastread;
      Serial.println(NewStatus);
      if (NewStatus == "S1") {
        statusAdding();
      }
      else {
        statusChecking();
      }
    }
  }
  // pings the server to keep the mqtt connection alive
  if (! mqtt.ping()) {
    mqtt.disconnect();
  }
}

void getMsgFromAndroid() {

  Serial.println("Waiting for message from Peer");
  int msgSize = nfc.read(ndefBuf, sizeof(ndefBuf));
  if (msgSize > 0) {
    NdefMessage msg  = NdefMessage(ndefBuf, msgSize);
    msg.print();
    int recordCount = msg.getRecordCount();
    NdefRecord record = msg.getRecord(0);
    userImei = readMsg(record);
    IMEI = userImei.toInt();
    detectedIMEI();
  }
  else {
    Serial.println("Failed");
  }
}

//Isolates the message from the rest of the record.
String readMsg( NdefRecord record ) {
  int payloadLength = record.getPayloadLength();
  byte payload[payloadLength];
  record.getPayload(payload);
  String payloadAsString = "";
  for (int c = 0; c < payloadLength; c++) {
    payloadAsString += (char)payload[c];
  }
  return payloadAsString.substring(3);
}

//Publishes the detected IMEI;
void detectedIMEI() {
  //Publishes detected imei.
  Serial.print(F("\nSending Detected Imei value: "));
  Serial.print(IMEI);
  Serial.print("...");
  if (! Imei.publish(IMEI))
  {
    Serial.println(F("Failed"));
  } else {
    Serial.println(F("OK!"));
  }
  delay(10);
  IMEI = 0;
}

//Displays that the user IMEI was registered and opens the door.
void accessGranted() {
  digitalWrite(ledG, HIGH);
  myservo.write(180);
  Serial.println("Your IMEI is registered, the door is now opened");
  delay(3000);
  myservo.write(0);
  digitalWrite(ledG, LOW);
  digitalWrite(ledB, HIGH);
  Serial.println("The door is now closed");
}

//Displays that the user IMEI was not registered.
void accessDenied() {
  digitalWrite(ledR, HIGH);
  Serial.println("Your IMEI is not registered");
  delay(2000);
  digitalWrite(ledR, LOW);
}

//Displays an error.
void error() {
  digitalWrite(ledR, HIGH);
  Serial.println("Error, your IMEI already exists in the server");
  delay(2000);
  digitalWrite(ledR, LOW);
  IMEI = 0;
}

//Displays the dection mode.
void statusAdding() {
  digitalWrite(ledR, HIGH);
  digitalWrite(ledB, HIGH);
  digitalWrite(ledG, HIGH);
  Serial.println("The next IMEI will be added to the server");
}

//Displays the dection mode.
void statusChecking() {
  digitalWrite(ledB, HIGH);
  Serial.println("The next IMEI will be checked to see if it is registered");
}

//Connects and reconnects as necessary to the MQTT server.
void MQTT_connect() {
  int8_t ret;

  // Stop if already connected.
  if (mqtt.connected()) {
    return;
  }

  Serial.print("Connecting to MQTT... ");

  uint8_t retries = 3;
  while ((ret = mqtt.connect()) != 0) { // connect will return 0 for connected
    Serial.println(mqtt.connectErrorString(ret));
    Serial.println("Retrying MQTT connection in 5 seconds...");
    mqtt.disconnect();
    delay(5000);  // wait 5 seconds
    retries--;
    if (retries == 0) {
      // basically die and wait for WDT to reset me
      while (1);
    }
  }
  Serial.println("MQTT Connected!");
}
