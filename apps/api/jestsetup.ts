/*
 Avoid the following error: 
 
 TypeError: this.mapper.addProfile is not a function
    at C:\dev\Adopt_A_Highway\apps\api\packages\nestjs\src\lib\abstracts\automapper-profile.abstract.ts:8:46
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
 */
process.on('unhandledRejection', (reason: string) => {
    throw reason;
});
