let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');

axios.get('https://klix.ba/najnovije')
    .then((response) => {
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            let newestKlixArticles = [];

            $('article.kartica.srednja').each(function (i, elem) {
                const $article = $(elem);

                newestKlixArticles[i] = {
                    intro: $article.find('.above .kategorija').text().trim(),
                    title: $article.find('h1').text().trim(),
                    url: `https://klix.ba${$article.find('a').prop('href')}`,
                    image: $article.find('img').prop('src'),
                    time: $article.find('.below .date:first-child').text().trim()
                }    
            });

            fs.writeFile('data/newestKlixArticles.json',
                JSON.stringify(newestKlixArticles, null, 4),
                (err) => {
                    if (err === null) {
                        console.log('File successfully written!');
                    } else {
                        console.log(`Write to file failed! ${err}`);
                    }
                }
            );
        }
    }, (error) => console.log(error));