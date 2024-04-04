from flask import Flask

app = Flask("Map")
app.debug = True

@app.route("/start.html")
def main():
    return "<p> Hello World </p>"


if __name__ == "__main__":
    app.run()