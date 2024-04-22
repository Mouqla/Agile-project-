from flask import Flask, request
from flask import render_template
import requests

app = Flask("Air Quality Map")
app.debug = True

@app.route("/")
def main():
    message = "Air Quality Map"
    return render_template('start.html', message=message)

#For OpenAQ
'''@app.route("/api/get_air")
def get_air():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    radius = request.args.get('radius')

    url_string = f"https://api.openaq.org/v2/latest?limit=1&offset=0&sort=desc&coordinates={lat}%2C{lng}&radius={radius}&order_by=distance&dump_raw=false"

    res = requests.get(url_string, headers={"X-API-Key": "e7293123084782b1bdf106b40b2d7ab678beca16d2667568b649d72d86c9a053"})
    return res.json()'''

# For openWeather
@app.route("/api/get_air")
def get_air():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    url_string = f"http://pro.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid="
    
    res = requests.get(url_string, headers={"X-API-Key": "126480978d9a03b6333e2560bef1313d"})
    return res.json()

@app.route("/api/get_city")
def get_city():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    url_string = f"http://pro.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&appid="
    
    res = requests.get(url_string, headers={"X-API-Key": "126480978d9a03b6333e2560bef1313d"})
    return res.json()

@app.route("/api/get_location")
def get_location():
    q = request.args.get('q')
    url_string = f"http://pro.openweathermap.org/geo/1.0/direct?q={q}&limit=1&appid="
    
    res = requests.get(url_string, headers={"X-API-Key": "126480978d9a03b6333e2560bef1313d"})
    return res.json()

@app.route("/api/get_location_multi")
def get_location_multi():
    q = request.args.get('q')
    limit = request.args.get('limit')
    url_string = f"http://pro.openweathermap.org/geo/1.0/direct?q={q}&limit={limit}&appid="

    res = requests.get(url_string, headers={"X-API-Key": "126480978d9a03b6333e2560bef1313d"})
    return res.json()

@app.route("/api/get_points")
def get_points():
    page = request.args.get('page')

    url_string = f"https://api.openaq.org/v2/latest?limit=1000&page={page}&sort=desc&order_by=distance&dump_raw=false"

    res = requests.get(url_string, headers={"X-API-Key": "e7293123084782b1bdf106b40b2d7ab678beca16d2667568b649d72d86c9a053"})
    return res.json()

@app.route('/info-frame.html')
def info_frame():
    return render_template('info-frame.html')

if __name__ == "__main__":
    app.run()

