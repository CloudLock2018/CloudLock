Adafruit MQTT Broker

Abrir y cerrar puerta
	Feed: Door
		Values: D0/MAC - Acceso denegado
			D1/MAC - Acceso permitido
			D2/MAC - Error al agregar


Enviar IMEI
	Feed: IMEI
		Values: 0 - Nulo
			XXXXXXXXX/MAC - IMEI enviado


Verificar o subir IMEI
	Feed: Status
		Values: S0/MAC - Verificar
			S1/MAC - Agregar


Guardar código genérico en el NodeMCU
	Feed: VerificationCode
		Values: 0 - Nulo
			XXXXXXXXXXX/MAC - Codigo asignado


Cuando se conecta el NodeMCU a la red
	Feed: MAC
		Values: 0 - Nulo
			MAC