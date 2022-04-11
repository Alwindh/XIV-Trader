from matplotlib.font_manager import json_dump
import requests
from urllib.parse import quote
import json

with open('.\\src\\helpers\\test.txt', 'r') as fileOpened:
    readFile = fileOpened.read()
    readFileSplit = readFile.split("\n")
    mainList = []
    for line in readFileSplit:
        if len(line) > 3:
            dicty={}
            cost = line.split(' ')[-1]
            name = line.split('   ')[0]
            while name[-1] != " ":
                name = name[:-1]
            if name[-1] == ' ':
                name = name[:-1]
            dicty['itemName']=name
            dicty['itemCost'] = int(cost)
            response = requests.get("https://xivapi.com/search?string_algo=match&string=%s"%(quote(name)))
            dicty['itemId']=response.json()['Results'][0]['ID']
            mainList.append(dicty)
    json.dump(mainList, open('JSON.json', 'w'))
            
    