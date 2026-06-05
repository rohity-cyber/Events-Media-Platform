exports.shareMedia =
async(req,res)=>{

  try{

    res.json({

      shareLink:
      `http://localhost:5173/shared/${req.params.id}`

    });

  }catch(error){

    res.status(500).json({

      message:
      error.message

    });

  }

};