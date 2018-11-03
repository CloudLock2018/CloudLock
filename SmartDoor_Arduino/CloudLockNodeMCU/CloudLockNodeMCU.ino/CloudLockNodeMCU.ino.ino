   #include <Adafruit_MQTT.h>
#include <Adafruit_MQTT_Client.h>
#include <FS.h>   
#include <ESP8266WiFi.h>
#include "SPI.h"
#include "PN532_SPI.h"
#include "snep.h"
#include "NdefMessage.h"
#include <Servo.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>

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

Adafruit_MQTT_Publish sendStatus = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/Status");

String DOOR;
String IMEI;
String NewStatus = "S0";

/*************************** Sketch Code ************************************/


PN532_SPI pn532spi(SPI, 5);
SNEP nfc(pn532spi);
uint8_t ndefBuf[128];
uint16_t  timeOut[128];
Servo myservo;
int servo = 16;
int ledR = 4;
int ledB = 0;
int ledG = 2;
bool sentImei = false;
unsigned long entry;

=======
WiFiManager wifiManager;

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

  
  wifiManager.setBreakAfterConfig(true);
  
  if (!wifiManager.autoConnect("CloudLock", "cloudlock")) {
    Serial.println("failed to connect, we should reset as see if it connects");
    delay(3000);
    ESP.reset();
    delay(5000);
  }
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  wifiConnectLed();
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Setup MQTT subscription for feeds.
  mqtt.subscribe(&doorState);
  mqtt.subscribe(&imeiStatus);
}

void loop() {
  MQTT_connect();
  Serial.println("Reseting");

  Adafruit_MQTT_Subscribe *subscription;
  //Checks value of subscribed feeds.
  while ((subscription = mqtt.readSubscription(4000))) {
    //Checks value of doorState feed.
    if (subscription == &doorState) {
      Serial.print(F("Last Door State value: "));
      DOOR = (char *)doorState.lastread;
      Serial.println(DOOR);
      if (DOOR == "D1") {
        accessGranted();
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
  if (sentImei == true) {
    accessDenied();
  }
  getMsgFromAndroid();
  Serial.println(sentImei);
}

void getMsgFromAndroid() {
  Serial.println("Waiting for message from Peer");
  int msgSize = nfc.read(ndefBuf, sizeof(ndefBuf), (uint16_t) 4000);
  Serial.println(msgSize);
  if (msgSize > 0) {
    NdefMessage msg  = NdefMessage(ndefBuf, msgSize);
    int recordCount = msg.getRecordCount();
    NdefRecord record = msg.getRecord(0);  //read 1 record
    msg.print();
    IMEI = readMsg(record);
    detectedIMEI();
  }
  else {
  Serial.println("Has not found any device");  
  }
}
//from the rest of the record.
String readMsg( NdefRecord record ) {
  int payloadLength = record.getPayloadLength();
  byte payload[payloadLength];
  record.getPayload(payload);
  String payloadAsString = "";
  for (int c = 0; c < payloadLength; c++) {
    payloadAsString += (char)payload[c];
  }
  if (payloadAsString.startsWith("es")) {
    return payloadAsString.substring(3);
  }
  else {
  return payloadAsString;
  }
}

//Publishes the detected IMEI;
bool detectedIMEI() {
  //Publishes detected imei.
  Serial.print(F("\nSending Detected Imei value: "));
  Serial.print(IMEI);
  Serial.print("...");
  
  if (! Imei.publish(String(IMEI).c_str()))
  {
  Serial.println(F("Failed"));
  }
  else {
    sendStatus.publish(String("S0").c_str());
    Serial.println(F(" OK!"));
    sentImei = true;
  }
  delay(10);
}

//Displays that the user IMEI was registered and opens the door.
void accessGranted() {
  digitalWrite(ledR, HIGH);
  digitalWrite(ledB, HIGH);
  digitalWrite(ledG, LOW);
  myservo.write(180);
  Serial.println("Your IMEI is registered, the door is now opened");
  delay(3000);
  myservo.write(0);
  Serial.println("The door is now closed");
  statusChecking();
  sentImei = false;
}

//Displays that the user IMEI was not registered.
void accessDenied() {
  digitalWrite(ledG, HIGH);
  digitalWrite(ledB, HIGH);
  digitalWrite(ledR, LOW);
  Serial.println("Your IMEI is not registered");
  delay(3000);
  statusChecking();
  sentImei = false;
}

//Displays the dection mode.
void statusAdding() {
  digitalWrite(ledR, LOW);
  digitalWrite(ledB, LOW);
  digitalWrite(ledG, LOW);
  Serial.println("The next IMEI will be added to the server");
}

//Displays the dection mode.
void statusChecking() {
  digitalWrite(ledR, HIGH);
  digitalWrite(ledG, HIGH);
  digitalWrite(ledB, LOW);
  Serial.println("The next IMEI will be checked to see if it is registered");
}

//Connects and reconnects as necessary to the MQTT server.
void MQTT_connect() {
  int8_t ret;

  // Stop if already connected.
  if (mqtt.connected()) {
    mqttConnectLed();
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

void mqttConnectLed() {
  digitalWrite(ledR, LOW);
  digitalWrite(ledB, LOW);
}

void wifiConnectLed () {
  digitalWrite(ledB, LOW);
  digitalWrite(ledG, LOW);
}
