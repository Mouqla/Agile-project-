from flask import Flask, request, jsonify
from flask import render_template
from apscheduler.schedulers.background import BackgroundScheduler
import requests
import json
import os
import atexit

app = Flask("Air Quality Map")
app.debug = True
heat_data_path = './static/data/data.json'
scheduler = BackgroundScheduler()

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

# Get forecast
@app.route("/api/get_forecast")
def get_forecast():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    url_string = f"http://pro.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lon}&appid="
    
    res = requests.get(url_string, headers={"X-API-Key": "126480978d9a03b6333e2560bef1313d"})
    return res.json()

# Get history
@app.route("/api/get_history")
def get_history():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    start = request.args.get('start')
    end = request.args.get('end')

    url_string = f"http://pro.openweathermap.org/data/2.5/air_pollution/history?lat={lat}&lon={lon}&start={start}&end={end}&appid="
    
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

@app.route("/api/return_points")
def return_points():
    try:
        with open(heat_data_path, 'r') as json_file:
            data = json.load(json_file)
        return jsonify(data)
    except(FileNotFoundError, json.JSONDecodeError):
        return jsonify({'error': 'Data file not found or corrupted'})

def get_points():
    all_data = []
    
    for i in range(1, 19):
        if i == 17:
            continue

        url_string = f"https://api.openaq.org/v2/latest?limit=1000&page={i}&sort=desc&order_by=distance&dump_raw=false"
        res = requests.get(url_string, headers={"X-API-Key": "e7293123084782b1bdf106b40b2d7ab678beca16d2667568b649d72d86c9a053"})
        new_data = res.json()
        if 'results' in new_data:
                all_data.extend(new_data['results'])
        else:
            print("No results found on page", i)

    if os.path.exists(heat_data_path):
        os.remove(heat_data_path)
    else:
        print('file does not exists!')

    with open(heat_data_path, 'w') as json_file:
        json.dump(all_data, json_file, indent=4)
        print('Data.json created.')

@app.route('/info-frame.html')
def info_frame():
    return render_template('info-frame.html')

@app.route('/forecast-history.html')
def forecast_history():
    return render_template('forecast-history.html')

get_points()
scheduler.add_job(func=get_points, trigger="interval", hours=1)
scheduler.start()
atexit.register(lambda: (print("Shutting down scheduler..."), scheduler.shutdown(wait=False)))

if __name__ == "__main__":
    app.run()

