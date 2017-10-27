mongo --host 127.0.0.1 --eval 'db = db.getSiblingDB("anychat");db.createUser({user: "anychat",pwd: "123456",roles: [ "readWrite", "dbAdmin" ]})'
