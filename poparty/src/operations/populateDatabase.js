var faker = require('faker')
const { Client } = require('pg')

function createClient(){
    client = new Client({
        user: 'masterusername',
        host: 'rds-postgresql-hotelreservation.cqfnnuiplrsh.us-east-2.rds.amazonaws.com',
        database: 'hotelreservation',
        password: 'aass!!07',
        port: 5432
    });

    return client;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

exports.createGuests = async function(n){
    client = createClient();
    client.connect();
    for(var guestid=1; guestid<=n; guestid++){
        var text = 
        `INSERT INTO guest(guestid, firstname, lastname, address, city, zipcode) 
        VALUES(${guestid}, 
        '${faker.name.firstName()}',
        '${faker.name.lastName()}',
        '${faker.address.streetAddress()}',
        '${faker.address.city()}',
        ${faker.address.zipCode()}
        )`;
        var res = await client.query(text);
        //console.log(res);
    }
    await client.end();
}

exports.createRooms = async function(r, n){
    client = createClient();
    client.connect();
    for(var hotelid=1; hotelid<=n; hotelid++){
        for(var roomnumber=1; roomnumber<=r; roomnumber++){
            var text = 
            `INSERT INTO room(roomid, roomnumber, hotelid) 
            VALUES(${hotelid*100+roomnumber}, 
            '${roomnumber}',
            '${hotelid}'
            )`;
            var res = await client.query(text);
            //console.log(res);
        }
    }
    await client.end();
}

exports.createHotels = async function(n){
    client = createClient();
    client.connect();
    for(var hotelid=1; hotelid<=n; hotelid++){
        var text = 
        `INSERT INTO hotel(hotelid, hotelname, address, city, zipcode) 
        VALUES(${hotelid}, 
        '${faker.company.companyName()}',
        '${faker.address.streetAddress()}',
        '${faker.address.city()}',
        ${faker.address.zipCode()}
        )`;
        var res = await client.query(text);
        //console.log(res);
    }
    await client.end();
}

exports.createReservations = async function(n, g, h, r){
    client = createClient();
    client.connect();
    for(var i=1; i<=n; i++){
        var hotel = getRandom(1, h);
        var room = getRandom(1, r);
        var guest = getRandom(1, g);
        var roomid = hotel*100+room;
        var text = 
        `INSERT INTO reservation(reservationid, roomid, guestid, checkindate, numberofdays) 
        VALUES(${i}, 
        ${roomid},
        ${guest},
        NOW() - '1 day'::INTERVAL * ROUND(RANDOM() * 100),
        ${getRandom(1, 20)}
        )`;
        var res = await client.query(text);
        //console.log(res);
    }
    await client.end();
}