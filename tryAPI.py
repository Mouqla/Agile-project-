import requests

res = requests.get("https://api.openaq.org/v2/latest?limit=1&offset=0&sort=desc&coordinates=57.71%2C11.97&radius=1000&order_by=distance&dump_raw=false", headers={"X-API-Key": "e7293123084782b1bdf106b40b2d7ab678beca16d2667568b649d72d86c9a053"})

print(res.text)