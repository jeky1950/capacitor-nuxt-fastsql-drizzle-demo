type RawResultData = {
	rows: unknown[] | unknown[][];
	columns: string[];
	numAffectedRows?: bigint;
}

// export const driver = async (
//     sql: string,
//     params: unknown[],
//     method: Sqlite3Method):Promise<RawResultData> => {
//         alert(JSON.stringify({ sql, params, method }))
// }