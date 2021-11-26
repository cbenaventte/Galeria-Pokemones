const http = require('http');
const fs = require('fs');
const axios = require('axios');

http
    .createServer((req, res) => {

        if (req.url == '/') {
            res.writeHead(200, { 'Content-Type': 'text:html' });
            fs.readFile('index.html', 'utf8', (err, html) => {
                res.end(html);
            })
        }

        if (req.url.startsWith('/pokemones')) {
            res.writeHead(200, { 'Content-Type': 'application/json' })

            let pokemonesPromesas = []

            async function pokemonesGet() {
                const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=150')
                return data.results
            }
            async function getFullData(name) {
                const { data } = await
                    axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
                return data
            }

            pokemonesGet().then((results) => {
                results.forEach((p) => {
                    let pokemonName = p.name
                    pokemonesPromesas.push(getFullData(pokemonName))
                })

                Promise.all(pokemonesPromesas).then((data) => {
                    let resultado = []
                    data.forEach((p) => {

                        let allpokemon = {
                            img: p.sprites.front_default,
                            nombre: p.name
                        }
                        resultado.push(allpokemon)
                        
                        //console.log(resultado)
                        
                    })
                        res.write(JSON.stringify(resultado, null, 1));
                        res.end();
                })

            })
        }
    })
    .listen(3000, () => console.log('Escuchando puerto 3000'));