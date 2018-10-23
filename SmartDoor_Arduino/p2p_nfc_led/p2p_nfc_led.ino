// Receive a NDEF message from a Peer
// Requires SPI. Tested with Seeed Studio NFC Shield v2

#include "SPI.h"
#include "PN532_SPI.h"
#include "snep.h"
#include "NdefMessage.h"
int RLED = D3;
int GLED = D4;
bool R_state = 1;
bool G_state = 1;
PN532_SPI pn532spi(SPI, 5);
SNEP nfc(pn532spi);
uint8_t ndefBuf[128];

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

void setup() {
  Serial.begin(9600);
  pinMode(RLED, OUTPUT);
  pinMode(GLED, OUTPUT);
  Serial.println("NFC Peer to Peer");
}



void loop() {
getMsgFromAndroid();
  delay(3000);
}


void SendMsgToAndroid() {
  Serial.println("Send a message to Peer");
  NdefMessage message = NdefMessage();
  String sendAndroid;
  sendAndroid = "RLED:" + String(digitalRead(RLED));
  sendAndroid += ", GLED:" + String(digitalRead(GLED));
  message.addTextRecord(sendAndroid);
  //message.addUriRecord("http://shop.oreilly.com/product/mobile/0636920021193.do");
  //message.addUriRecord("http://arduino.cc");
  //message.addUriRecord("https://github.com/don/NDEF");


  int messageSize = message.getEncodedSize();
  if (messageSize > sizeof(ndefBuf)) {
    Serial.println("ndefBuf is too small");
    while (1) {
    }
  }
  message.encode(ndefBuf);
  if (0 >= nfc.write(ndefBuf, messageSize)) {
    Serial.println("Failed");
  } else {
    Serial.println("Success");
  }
  //Serial.println(digitalRead(SW));
}



void getMsgFromAndroid() {

  Serial.println("Waiting for message from Peer");
  int msgSize = nfc.read(ndefBuf, sizeof(ndefBuf));
  if (msgSize > 0) {
    NdefMessage msg  = NdefMessage(ndefBuf, msgSize);
    msg.print();
    int recordCount = msg.getRecordCount();
    NdefRecord record = msg.getRecord(0);  //read 1 record
    String myLED = readMsg(record);
    if (myLED == "Imei") {
      digitalWrite(RLED, R_state);
      Serial.println("RedLed changed");
      R_state = !R_state;
    } else if (myLED == "green") {
      digitalWrite(GLED, G_state);
      G_state = !G_state;
    }
  } else {
    Serial.println("Failed");
  }
  //Serial.println(digitalRead(SW));
}





