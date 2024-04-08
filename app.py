from flask import Flask, request
from flask import render_template
import requests

app = Flask("Air Quality Map")
app.debug = True

@app.route("/")
def main():
    message = "Air Quality Map"
    return render_template('start.html', message=message)

@app.route("/api/get_air")
def get_air():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    radius = request.args.get('radius')

    url_string = f"https://api.openaq.org/v2/latest?limit=1&offset=0&sort=desc&coordinates={lat}%2C{lng}&radius={radius}&order_by=distance&dump_raw=false"

    res = requests.get(url_string, headers={"X-API-Key": "e7293123084782b1bdf106b40b2d7ab678beca16d2667568b649d72d86c9a053"})
    return res.json()

if __name__ == "__main__":
    app.run()