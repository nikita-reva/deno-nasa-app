import { Application, send, log } from './deps.ts';

import api from './api.ts';

const app = new Application();

const PORT = 8000;

await log.setup({
	handlers: {
		console: new log.handlers.ConsoleHandler('INFO'),
	},
	loggers: {
		default: {
			level: 'INFO',
			handlers: ['console'],
		},
	},
});

app.addEventListener('error', (event) => {
	log.error(event.error);
});

app.use(async (ctx, next) => {
	try {
		await next();
	} catch (error) {
		ctx.response.body = 'Internal server error';
		throw error;
	}
});

app.use(async (ctx, next) => {
	await next();
	const time = ctx.response.headers.get('X-Response-Time');
	log.info(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const delta = Date.now() - start;
	ctx.response.headers.set('X-Response-Time', `${delta}ms`);
});

app.use(api.routes());
app.use(api.allowedMethods());

app.use(async (ctx) => {
	const filePath = ctx.request.url.pathname;

	const fileWhitelist = [
		'/index.html',
		'/javascripts/script.js',
		'/stylesheets/style.css',
		'/images/favicon.png',
		'/videos/earth.mp4',
	];

	if (fileWhitelist.includes(filePath)) {
		await send(ctx, filePath, {
			root: `${Deno.cwd()}/public`,
		});
	}
});

app.use((ctx) => {
	ctx.response.body = `
    {___     {__      {_         {__ __        {_       
    {_ {__   {__     {_ __     {__    {__     {_ __     
    {__ {__  {__    {_  {__     {__          {_  {__    
    {__  {__ {__   {__   {__      {__       {__   {__   
    {__   {_ {__  {______ {__        {__   {______ {__  
    {__    {_ __ {__       {__ {__    {__ {__       {__ 
    {__      {__{__         {__  {__ __  {__         {__
                    Mission Control API`;
});

if (import.meta.main) {
	log.info(`Server started at port ${PORT}.`);
	await app.listen({ port: PORT });
}
