import MetaInspector from 'node-metainspector'

export function grabTitle(req, res){

  const url = req.body.url

  if (url.endsWith('gif') || url.endsWith('gifv') || url.endsWith('jpg') || url.endsWith('jpeg') || url.endsWith('mov') || url.endsWith('png')) {
    return res.send({ok: false})
  }

  var client = new MetaInspector(req.body.url, { timeout: 5000 });

  client.on("fetch", function(){
    res.json({'title': client.title, 'ogTitle': client.ogTitle, 'host': client.host, 'image': client.image})
  })

  client.on("error", function(err){
    return err
  })

  client.fetch()

}

