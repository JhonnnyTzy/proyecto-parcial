const http = require('http');
const { Pool } = require('pg');

// Configuración de PostgreSQL (Docker)
const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'mydb',
    password: 'password',
    port: 5432,
});

const server = http.createServer(async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204).end();
        return;
    }

    // POST: Recibir datos del formulario
    if (req.url === '/contacto' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { nombre, email, mensaje } = JSON.parse(body);
                console.log('Datos recibidos:', { nombre, email, mensaje });
                
                // Guardar en PostgreSQL (Docker)
                await pool.query(
                    'INSERT INTO contactos (nombre, email, mensaje) VALUES ($1, $2, $3)',
                    [nombre, email, mensaje]
                );
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Datos guardados' }));
            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500).end('Error interno');
            }
        });
    }

    // PUT: Ejemplo de actualización
    else if (req.url === '/recurso/1' && req.method === 'PUT') {
        res.writeHead(200).end('Recurso actualizado');
    }

    // DELETE: Ejemplo de eliminación
    else if (req.url === '/recurso/1' && req.method === 'DELETE') {
        res.writeHead(204).end();
    }

    // Ruta no encontrada
    else {
        res.writeHead(404).end('Ruta no encontrada');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor Node.js escuchando en http://localhost:${PORT}`);
});