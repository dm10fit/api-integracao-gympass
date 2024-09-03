const db = require("./database")

//Vefico qual é o cliente
exports.Authenticate = async (req, resp, next) =>{

  //Pego o parametro da academia
  const academia = req.params.idAcademia

  //Crio a conexão com o BD
  const dbaccess = await db('dm10fitaccess')
  //Busco o cliente informado no primeiro paramêtro da URL (:academia)
  const result = await dbaccess.query(`SELECT CodCliente, NomeBD, HostBd, UserBd, PswBD FROM tblclienteacesso WHERE route = ?`,[academia])
  //Destroi a conexão com o banco de dados
  
  if(result[0][0] == '' || result[0][0] == null ){
    resp.send('<h1>Link inválido</h1>')
  }else{
    //Pego o nome do banco de dados. 
    resp.locals.nomebd = result[0][0].nomebd
    //Carrego o código do cliente na váriavel global
    resp.locals.codcliente = result[0][0].codcliente
    //Insiro o código do cliente no obj de requisição
    req.codcliente = result[0][0].codcliente

    //Pega o Host do BD
    resp.locals.host = result[0][0].hostbd

    resp.locals.namecliente = academia

    resp.locals.userbd = result[0][0].userbd;
    resp.locals.pswbd = result[0][0].pswbd; 
 
    await dbaccess.destroy();

    //Passa para o próximo middleware
    next();
  }

}