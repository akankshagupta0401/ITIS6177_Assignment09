const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const mariadb = require('mariadb');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
  // create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//app.use(express.bodyParser());
app.use(bodyParser.json());
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const options = {
     swaggerDefinition: {
        info:{
       title: 'Assignment8: REST API With Swagger',
       version: '1.0.0',
       description: 'REST API with Swagger'         },
         host: '143.198.177.153:3000',
         basePath: '/',
     },
     apis: ['./server.js'], };

const specs = swaggerJsdoc(options);

app.use('/docs',  swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

//Axios 
app.get('/say', async(req,res) => {
    axios.get('https://1plu5e54u3.execute-api.us-east-2.amazonaws.com/Test/say?keyword='+ req.query.keyword)
    .then(resp => {
    //console.log(resp.data);
    res.send(resp.data);
    })
});

const pool = mariadb.createPool({
        host: 'localhost',
     user: 'root',
     password: 'root',
     database: 'sample',
     port: 3306,
     connectionLimit: 5 });
/**
* @swagger
* definitions:
*  company:
*   type: object
*   properties:
*    COMPANY_ID:
*     type: string
*     description: The auto-generated id of the company
*     example: '234'
*    COMPANY_NAME:
*     type: string
*     description: The company name
*     example: 'Tesla'
*    COMPANY_CITY:
*     type: string
*     description: The company city
*     example: 'NEW York'
*  foods:
*   type: object
*   properties:
*    ITEM_ID:
*     type: string
*     description: The auto-generated id of the food
*     example: '1'
*    ITEM_NAME:
*     type: string
*     description: The food item name
*     example: 'Chex Mix'
*    ITEM_UNIT:
*     type: string
*     description: Unit of food item
*     example: 'pcs'
*    COMPANY_ID:
*     type: string
*     description: company ID
*     example: 16
*/
/**
* @swagger
* /api/v1/agents:
*     get:
*       description: Return All Agents
*       produces:
*          -application/json
*       responses:
*          200:
*               description: Object agent containing agents details
*/
app.get('/api/v1/agents', async (req, res) => {
    try {
        const result = await pool.query("select * from agents");
        res.json(result);
 
    } catch (err) {
        throw err;
    }
  });
 
 /**
 * @swagger
 * /api/v1/foods:
 *     get:
 *       description: Return All foods
 *       produces:
 *          -application/json
 *       responses:
 *          200:
 *               description: Object food containing object food details
 */
 app.get('/api/v1/foods', async (req, res) => {
     try {
        const result = await pool.query("select * from foods");
        res.send(result);
                                                                                                                    
   }                                                                                                        
   catch (err)                                                                                                
   {                                                                                                          
         throw err;                                                                                           
     }                                                                                                        
   });                                                                                                        
                                                                                                              
  /**                                                                                                         
  * @swagger                                                                                                  
  * /api/v1/customer:                                                                                         
  *     get:                                                                                                  
  *       description: Return All Customer                                                                    
  *       produces:                                                                                           
  *          -application/json                                                                                
  *       responses:                                                                                          
  *          200:                                                                                             
  *               description: Object customer containing customer details                                    
  */                                                                                                          
  app.get('/api/v1/customer', async (req, res) => {                                                           
      try {                                                                                                   
       const result = await pool.query("select * from customer where CUST_CITY ='London' ");                  
         res.send(result);                                                                                    
                                                                                                              
     }                                                                                                        
  catch (err) {                                                                                               
        throw err;                                                                                            
  }                                                                                                           
  });                                                                                                         
                                                                                                              
/**                                                                                                         
* @swagger                                                                                                  
* /api/v1/newcompany:                                                                                       
*  post:                                                                                                    
*   summary: Add Company                                                                                    
*   description: Add new company                                                                            
*   consumes:                                                                                               
*     - application/json
*   produces:
*     - application/json
*   parameters:
*     - in: body
*       name: body
*       description: body object
*       schema:
*        $ref: '#/definitions/company'
*   requestBody:
*    content:
*     application/json:
*      schema:
*       $ref: '#/definitions/company'
*   responses:
*          200:
*               description: The company was successfully created
*               content:
*                application/json:
*                 schema:
*                  $ref: '#/definitions/company'
*          500:
*               description: Failure in creating company
*/
app.post('/api/v1/newcompany', async (req, res) => {
    let company = req.body;
    
    conn = await pool.getConnection();
    console.log(req.body);
    try {
            const { COMPANY_ID, COMPANY_NAME, COMPANY_CITY} = req.body;
            const result = await conn.query("insert into company (COMPANY_ID, COMPANY_NAME, COMPANY_CITY) values (?,?,?)",
            [company.COMPANY_ID, company.COMPANY_NAME, company.COMPANY_CITY]);
            //res.send(result);
            res.json(result.rows[0]);
      } catch (err) {
        res.send(err);
    }
   });
   
   /**
    * @swagger
    * /api/v1/company/?id=:
    *  put:
    *   summary: update company
    *   description: update company
    *   consumes:
    *    - application/json
    *   produces:
    *    - application/json
    *   parameters:
    *    - in: query
    *      name: id
    *      schema:
    *       type: string
    *      required: true
    *      description: id of the company
    *      example: '123'
    *    - in: body
    *      name: body
    *      required: true
    *      description: body object
    *      schema:
    *       $ref: '#/definitions/company'
    *   requestBody:
    *    content:
    *     application/json:
    *      schema:
    *       $ref: '#/definitions/company'
    *   responses:
    *    200:
    *     description: success
    *     content:
     *      application/json:
 *       schema:
 *        $ref: '#/definitions/company'
*/

app.put('/api/v1/company', async(req,res)=>{
    conn = await pool.getConnection();
    let company = req.body;
    try{
    
    
         const result = await conn.query("UPDATE company SET COMPANY_NAME=?, COMPANY_CITY=? where COMPANY_ID= ?",
                 [company.COMPANY_NAME, company.COMPANY_CITY, company.COMPANY_ID]);
            res.send(result);
         }
    catch (error)
     {
             res.status(500).json(error);
         }
    });
    
    app.get('/api/v1/company', async (req, res) => {
         try {
          const result = await pool.query("select * from company ");
            res.send(result);
         }
    catch (err)
     {
           throw err;
     }
     });
    
    /**
    * @swagger
    * /api/v1/foods/?code=:
*  patch:
*   summary: update food details
*   description: update food details
*   consumes:
*    - application/json
*   produces:
*    - application/json
*   parameters:
*    - in: query
*      name: id
*      schema:
*       type: string
*      required: true
*      description: id of the food
*      example: '1'
*    - in: body
*      name: body
*      required: true
*      description: body object
*      schema:
*       $ref: '#/definitions/foods'
*   responses:
*    200:
*      description: 'Food detail is updated successfully'
*    400:
*      description: Bad request
*/
app.patch("/api/v1/foods", async (req, res) => {
    let conn = await pool.getConnection();
       let id = req.query.id;
       let food =  req.body;
     try {
       const result = await pool.query("UPDATE foods SET ITEM_NAME=?,ITEM_UNIT=?,COMPANY_ID=? WHERE ITEM_ID=?",
                                       [food.ITEM_NAME,food.ITEM_UNIT, food.COMPANY_ID,id]);

                                       res.send(result);
                                    }
                                catch (err)
                                {
                                res.send(err);
                                    //throw err;
                                   }
                                 });
                                
                                /**
                                * @swagger
                                * /api/v1/company?id=:
                                *  delete:
                                *   description: deletion of company using company id
                                *   produces:
                                *    - "application/json"
                                *   parameters:
                                *    - name: id
                                *      in: query
                                *      description: "ID of the company"
                                *      required: true
                                *   responses:
                                *          200:
                                *              description: "Company is deleted successfully"
                                */
                                app.delete("/api/v1/company", async (req, res) => {
                                  const conn = await pool.getConnection();
                                  try {
                                    let id = req.query.id;
                                   const  result = await conn.query("DELETE FROM company WHERE COMPANY_ID = ?", [id]);
                                   res.send(result);
                                   }
                                 catch (err) {
                                    res.send(err);
                                    //throw err;
                                 }
                                 });
                                 
app.listen(port, () =>{
    console.log(`Example app listening at http://localhost:${port}`)
});      