const mariadb = require('mariadb');
const dbInfo = require('./db-info.js');


const pool = mariadb.createPool(dbInfo);
const insertSql = "INSERT INTO CATEGORY_INFO(CAI_TYPE,CAI_DEP1 credat, cretim, creusr, moddat, modtim, modusr)";
insertSql += " VALUES(";
insertSql += " 1,?";
insertSql += " DATE_FORMAT(NOW(),'%Y%m%d'),		DATE_FORMAT(NOW(),'%H%i%S'),1,";
insertSql += " DATE_FORMAT(NOW(),'%Y%m%d'),		DATE_FORMAT(NOW(),'%H%i%S'),1";
insertSql += " )";
const deleteSql = "DELETE FROM crawling_info WHERE DATE_FORMAT(credat,'%Y-%m-%d') != DATE(now())";



async function insertCrawlingInfo(params) {
  let con;
  try {
    con = await pool.getConnection();
    const result = await con.query(insertSql, params);
    con.commit();
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (con) con.release(); //release to pool
  }
}
async function deleteCrawlingInfo() {
  let con;
  try {
    con = await pool.getConnection();
    const result = await con.query(deleteSql);
    con.commit();
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (con) con.release(); //release to pool
  }
}
async function selectShopInfo() {
  let conn;
  let list = [];
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT SHI_NUM,SHI_CRAWLING_WORD from shop_info where SHI_CRAWLING_WORD IS NOT NULL");
    for (let i = 0; i < rows.length; i++) {
      list.push(rows[i]);
    }
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
  return list;
}
var dao = {
  insertCrawlingInfo: insertCategoriInfo,
  selectShopInfo: selectShopInfo,
  deleteCrawlingInfo: deleteCrawlingInfo
}
module.exports = dao;