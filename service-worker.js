const CACHE_NAME = 'impostor-cache-v1';
const urlsToCache = [
  '/', 
  'IMPOSTOR!.html', // O seu jogo
  'manifest.json',
  'icon-192.png', // O ícone PWA
  // Adicione a fonte do Tailwind para que o estilo funcione offline
  'https://cdn.tailwindcss.com' 
];

// Instalação: Cacheia os arquivos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação: Limpa caches antigos (opcional, mas recomendado)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Busca: Serve arquivos do cache (offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna a resposta do cache, se disponível
        if (response) {
          return response;
        }
        // Caso contrário, busca na rede
        return fetch(event.request);
      })
  );
});
