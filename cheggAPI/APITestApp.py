import time
from flask import Blueprint, render_template, request, redirect, url_for, flash, abort, jsonify, send_file

APITestApp = Blueprint('APITestApp', __name__, static_folder='static', template_folder='templates')

# routes  
@APITestApp.route('/', methods=["GET"])
def index():
    # you can change this route to a redirect or an html page, but don't delete it
    return redirect(url_for('APITestApp.showSearchPage'))

@APITestApp.route('/search', methods=["GET"])
# @login_required
def showSearchPage():
    return render_template('search.html')

@APITestApp.route('/get-result', methods=["POST"])
# @login_required
def getResult():
    urlToSearch = request.json['url']
    print('Searching for: ' + urlToSearch)
    
    fileName = 123456

    resultUrl = f'{url_for("APITestApp.viewResult")}?question={fileName}'
    
    return jsonify({ 'result_url': resultUrl })

@APITestApp.route('/view-result', methods=["GET"])
# @login_required
def viewResult(question = None):
    question = request.args.get('question')
    if question is None:
        abort(404)
    else:
        print('Viewing result for: ' + question)
    return render_template('showResults.html', fileName = question)

@APITestApp.route('/get-file/<fileName>', methods=["GET"])
# @login_required
def getFile(fileName):
    return send_file(f'./blueprints/api_test/retrieved_pages/{fileName}', as_attachment=True)

