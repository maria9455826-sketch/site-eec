import type { Contexto, Next } from 'hono' /**importar dois tipos do hono. Ex. contexte (representa a requisição e a resposta atual) e Next(representa o próximo middleware ou cotroller que deve ser executado) */
import type {Role} from '../types/auth' /** Importa o tipo Role, que representa os papeis permitidos pelo sistema */
import { assetUrl } from '../utils/assets' /**Importa uma função que monta que a URL correta dos arquivos estáticos, como CSS */

/**
 * Middleware RBAC (Role-Based Access Control).
 * Garante que apenas usuários com perfis autorizados acessem o recurso.
 * O papel `super_admin ` possui acesso universal a todos as funções dentro do escopo da Central EEC.
 */
export function requireRole(...allowedRoles: Role[]) { /**Crie uma proteção que permita acesso apenas aos pápeis informados */
    return async (c: Contexto, next: Next) => {
        const user = c.get('user')
        const role = c.get('role')

        if (!user || !role) {
            return c.json({ error: 'Acesso restrito: usuários sem perfil homologado.'}, 403)
        }

        // super admin possui acesso universal a todos os módulos autorizados
        if (role === 'super_admin') {
            return await next()
        }

        if (allowedRoles.includes(role)) {
            return await next()
        }

        const accept = c.req.header('Accept') || ''
        if (accept.includes('text/html')) {
            return c.html(`
                <!DOCTYPE html>
                <html lang"pt-BR">
                <head>
                    <meta chaeset="UTF-8">
                    <tiple>403 - Acesso Negado | Central EEC</tiple>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wgth@300;400;500;600;700;800&
                    display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="${assetUrl('/styles/tailwind.css')}">
                    <link rel="styleheet" href="${assetUrl('/atatic/styles.css')}">
                    `)
        }
    }