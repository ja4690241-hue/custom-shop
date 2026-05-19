# Custom Shop - TODO

## Arquitetura e Planejamento
- [x] Inicializar projeto web com db, server e user
- [x] Definir design system e paleta de cores elegante
- [x] Buscar referências visuais para inspiração

## Banco de Dados
- [x] Criar tabelas: products, categories, cart_items, orders, order_items
- [x] Implementar migrations SQL
- [x] Criar query helpers em server/db.ts

## Página Inicial
- [x] Design hero banner elegante
- [x] Seção de produtos em destaque
- [x] Seção de categorias (canecas e camisetas)
- [x] Footer com informações

## Catálogo de Produtos
- [x] Página de listagem com grid responsivo
- [x] Filtros por categoria
- [x] Exibição de foto, nome, preço e botão de compra
- [ ] Paginação ou infinite scroll

## Página de Detalhes do Produto
- [x] Galeria de imagens do produto
- [x] Opções de personalização (texto, cor, tamanho)
- [x] Botão adicionar ao carrinho
- [ ] Preço com cálculo de personalização

## Carrinho de Compras
- [x] Visualização de itens no carrinho
- [x] Editar quantidade e remover itens
- [x] Cálculo automático do total
- [ ] Persistência do carrinho (localStorage/DB)

## Checkout e Pedidos
- [x] Formulário de dados do cliente
- [x] Formulário de endereço de entrega
- [ ] Integração com pagamento (Stripe)
- [ ] Confirmação de pedido
- [ ] Envio de email de confirmação

## Painel Administrativo
- [x] Dashboard com estatísticas
- [x] Listagem de produtos
- [x] Adicionar novo produto com upload de imagem
- [x] Editar produto
- [x] Remover produto
- [ ] Gerenciar categorias
- [ ] Visualizar pedidos

## Histórico de Pedidos
- [x] Página de pedidos do usuário logado
- [ ] Detalhes do pedido
- [ ] Status do pedido
- [ ] Rastreamento

## Autenticação
- [ ] Integrar OAuth Manus
- [ ] Proteção de rotas administrativas
- [ ] Proteção de rotas de usuário autenticado

## Upload de Imagens
- [ ] Integrar S3 para armazenamento
- [ ] Upload de imagens de produtos
- [ ] Validação de imagens
- [ ] Exibição de imagens do S3

## Testes
- [ ] Testes unitários com Vitest
- [ ] Testes de integração
- [ ] Testes E2E

## Deploy
- [ ] Criar checkpoint final
- [ ] Publicar no Manus
