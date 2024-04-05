from flask import Flask
from flask import render_template

app = Flask("Air Quality Map")
app.debug = True

@app.route("/")
def main():
    message = "Air Quality Map"
    return render_template('start.html', message=message)


if __name__ == "__main__":
    app.run()