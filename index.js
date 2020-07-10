const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser= require('body-parser')

const app = express();
const mustache = mustacheExpress();
const { Client } =  require('pg');
mustache.cache =null;


app.engine('mustache',mustache);
app.set('view engine','mustache');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.get('/add',(req,res)=>{
    res.render("med-form");
})

app.post('/meds/add',(req,res)=>{

    // console.log('post body',req.body)
    const client = new Client({
        user : 'postgres',
        host : 'localhost',
        database :'medical1',
        password : 'test1234',
        port : 5432,
    });
    client.connect()
    .then(()=>{
        console.log("Connection complete");
        const sql =' INSERT INTO meds(name,count,brand) VALUES ($1,$2,$3)';
        const params = [req.body.name,req.body.count,req.body.brand];
        return client.query(sql,params);
    })
    .then(result => console.log('results?',result))
    res.redirect('/meds');
    
})

//Dashboard

app.get('/dashboard',(req,res)=>{
    const client = new Client({
        user : 'postgres',
        host : 'localhost',
        database :'medical1',
        password : 'test1234',
        port : 5432,
    });
    client.connect()
    .then(()=>{
        return client.query('SELECT SUM(count) FROM meds; SELECT DISTINCT COUNT(brand) FROM meds')
    })
    .then((results) => {
        // console.log('results?',results[0])
        // console.log('results?',results[1])
       res.render('dashboard',{n1:results[0].rows,n2:results[1].rows})
    }); 
})

//Get All the medicenes
app.get('/meds',(req,res)=>{

    const client = new Client({
        user : 'postgres',
        host : 'localhost',
        database :'medical1',
        password : 'test1234',
        port : 5432,
    });
    client.connect()
    .then(()=>{
       return client.query('SELECT * FROM meds')
    })
    .then((results) => {
        // console.log('results?',results)
        res.render('meds',results)
    }); 
});

//Delete the medicenes
app.post('/meds/delete/:id',(req,res)=>{
    const client = new Client({
        user : 'postgres',
        host : 'localhost',
        database :'medical1',
        password : 'test1234',
        port : 5432,
    });
    client.connect()
    .then(()=>{
       const sql='DELETE FROM meds WHERE mid=$1'
       const params = [req.params.id];
       return client.query(sql,params)
    })
    .then((results) => {
       res.redirect('/meds');
    }); 

})

//Select for Edit medicenes
app.get('/meds/edit/:id',(req,res)=>{
    const client = new Client({
        user : 'postgres',
        host : 'localhost',
        database :'medical1',
        password : 'test1234',
        port : 5432,
    });
    client.connect()
    .then(()=>{
       const sql='SELECT * FROM meds WHERE mid=$1'
       const params = [req.params.id];
       return client.query(sql,params)
    })
    .then((results) => {
        // console.log('results?',results)
        res.render('meds-edit',{med: results.rows[0]});
    }); 
})

//Edit
app.post('/meds/edit/:id',(req,res)=>{
    const client = new Client({
        user : 'postgres',
        host : 'localhost',
        database :'medical1',
        password : 'test1234',
        port : 5432,
    });
    client.connect()
    .then(()=>{
       const sql='UPDATE meds SET name=$1,count=$2, brand=$3 WHERE mid=$4'
       const params = [req.body.name,req.body.count,req.body.brand,req.params.id];
       return client.query(sql,params);
    })
    .then((results) => {
        // console.log('results?',results)
        res.redirect('/meds');
    })
   

});
app.listen(5001,()=>console.log('Listening to port 5001'));