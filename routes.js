var Schema = require('./schema');
var persondetails = Schema.PersonDetails;

module.exports= router =>{
    router.post('/signup', async (req, res) => {

        var data = req.body;
        console.log(data,"dat for signup=====>>>>")
        const person_details = new Schema.PersonDetails({
            firstname: data.firstname,
            lastname:data.lastname,
            email: data.email,
            mobileNo: data.phoneno,
            password: data.password,
            groupname: data.groupname,
        })
        person_details.save().then(() => {
            res.send({
                'result': "All the details are saved successfully",
                
            });
        });

    })
    router.post('/signin', async (req, res) => {
        console.log(req.body,"singin")
        let email = req.body.email 
        let password = req.body.password + "";
        persondetails.findOne({ 'email': email, 'password': password }, function (error, data) {
            console.log(data,"data=====>>>")
            if (data == null){
                res.send({result:"Incorrect user name or password"});
            }
            else if(data.email == email && data.password == password){
                res.send({ result:data
            })
            
            }
        });
    });

    router.post('/startmeeting', async (req, res) => {
        console.log(req.body,"singin")
        let roomlink = req.body.roomlink 
        let id= req.body.id;
        persondetails.updateOne({"_id":id},{$set:{"url":roomlink,"signin":true}}, function (error, data) {
            console.log(data,"data=====>>>")

            res.send({ result:"success"})
         
        });
    });
    router.post('/signincheck', async (req, res) => {
        console.log('"' + req.body.url+ '"',"singinchecking")
        let url1 =  req.body.url; 
        persondetails.findOne({ '_id':url1},  async function (error, data) {
           if(error){
               console.log(error)
           }
            // console.log(data,"data=+++====>>>")
            if (data == null){
                res.send({result:"Something went wrong"});
            }
            else {
                res.send({ result:data.signin
            })
            
            }
        });
    });
    router.post('/signout', async (req, res) => {
        let mongoid =  req.body.id; 
        console.log(mongoid)
        persondetails.updateOne({"_id":mongoid},{$set:{"signin":false}}, function (error, data) {
            console.log(data,"data=====>>>")

            res.send({ result:"success"})
         
        });
    });



}