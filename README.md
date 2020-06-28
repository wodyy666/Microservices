# Microservices
Dieses Projekt wurde im Rahmen der Vorlesung "Microservices mit Node.js" entwickelt. Weitere Informationen über das Projekt finden Sie in der Projektdokumentation. Diese befindet sich im Ordner /Doku/. Diese Datei dient nur zur Erläuterung der notwendigen Installationsschritte und als kurze Anleitung zur Benutzung der Anwendung.

## Installation
1. Lade dieses Repository runter und öffne den Ordner
2. Führe den Befehl ```npm install``` aus

## Konfiguration
Die Anwendung nutzt den Port 3000. Falls dieser Port bereits belegt ist, ist es möglich einen anderen Port in den Konfigurationsdateien anzugeben. Im Ordner /config/ befinden sich diese Dateien.

## Inbetriebnahme
Mit dem Befehl ```npm start``` kann diese Anwendung gestartet werden. Das machine learning Modell wurde bereits trainiert und kann deshalb direkt genutzt werden.

## Verwenden / Testen
Die Anwendung sollte jetzt lokal auf dem Rechner laufen. Mit dem Browser kann man sie jetzt unter diesem Link aufrufen: http://127.0.0.1:3000/
Auf der Website kann man...
- mit seiner Maus in dem weißen Fenster eine Ziffer zeichnen. 
- mit dem Knopf "clear" das gezeichnete wieder löschen. 
- mit dem Knopf "send" das gezeichnete an das Backend senden, wo es dann analysiert wird. Nachdem die Analyse abgeschlossen ist wird das Ergebnis angezeigt
- mit der Checkbox Auto-Updates aktivieren. Wenn Auto-Updates aktiv sind wird automatisch eine Anfrage an das Backend gesendet, wenn etwas neues gezeichnet wurde.

## Modell trainieren
Es ist möglich Änderungen an dem machine learning Modell zu machen. Dazu kann die tensorflow.js Konfigurationsdatei bearbeitet werden. 
Nachdem Änderungen an dieser Datei gespeichert wurden kann das Modell erneut trainiert werden, indem eine Anfrage an /train gesendet wird. Eventuell ist es notwendig die Anwendung neu zu starten, damit die Änderungen übernommen werden.
