const version = 1;
const cachename = 'app-fc-v' + version;

const arquivos = [
  'home.html',
  'manifest.json',
  'service-worker.js',
  'HTML/paginaCliente.html',
  'HTML/paginaVendedor.html',
  'JS/navegacaoSPA.js',
  'JS/paginaVendedor.js',
  'JS/main.js',
  'JS/dados.json',
  'CSS/style.css',
  'CSS/paginaVendedor.css',
  'IMAGENS/pote-mel.jpg',
  'IMAGENS/sacos-trigo.jpg',
  'IMAGENS/icone192.png',
  'IMAGENS/icone512.png',
  'IMAGENS/logo-3.png',
  'IMAGENS/manoel-gomes.jpg',
  'IMAGENS/organic-box.jpg',
];


self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cachename).then(function (cache) {
      return cache.addAll(arquivos);
    })
    
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request)
          .then(function (response) {
            let responseClone = response.clone();

            caches.open(cachename).then(function (cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function () {
            return caches.match('home.html');
          });
      }
    })
  );
});
