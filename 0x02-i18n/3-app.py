#!/usr/bin/env python3
"""Get locale"""

from flask import Flask, render_template, request
from flask_babel import Babel


class Config:
    """Config"""

    DEBUG = True
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """getting the local
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index() -> str:
    """index"""
    return render_template("3-index.html")

# uncomment this line and comment the @babel.localeselector.
# you get this error:
# AttributeError: 'Babel' object has no attribute 'localeselector'
# babel.init_app(app, locale_selector=get_locale)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
