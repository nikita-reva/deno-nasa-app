import { Router } from './deps.ts';

import * as planets from './models/planets.ts';
import * as launches from './models/launches.ts';

const router = new Router();

router.get('/', (ctx) => {
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

router.get('/planets', (ctx) => {
	// ctx.throw(400, 'Sorry, planets are not awailable!');
	ctx.response.body = planets.getAllPlanets();
});

router.get('/launches', (ctx) => {
	ctx.response.body = launches.getAllLaunches();
});

router.get('/launches/:id', (ctx) => {
	if (ctx.params?.id) {
		const launchesList = launches.getOneLaunch(Number(ctx.params.id));

		if (launchesList) {
			ctx.response.body = launchesList;
		} else {
			ctx.throw(400, "Launch with that ID doesn't exist.");
		}
	}
});

router.delete('/launches/:id', (ctx) => {
	if (ctx.params?.id) {
		const result = launches.removeOneLaunch(Number(ctx.params.id));
		ctx.response.body = { success: result };
	}
});

router.post('/launches', async (ctx) => {
	const body = await ctx.request.body().value;

	launches.addOneLaunch(body);

	ctx.response.body = { success: true };
	ctx.response.status = 201;
});

export default router;
