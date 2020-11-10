const mariadb = require('mariadb');
const dbInfo = require('./db-info.js');

const pool = mariadb.createPool(dbInfo);
const insertCategoriInfoSql = "INSERT INTO CATEGORY_INFO(CAI_TYPE,CAI_DEP1) VALUES(1,?)";
const deleteSql = "DELETE FROM crawling_info WHERE DATE_FORMAT(credat,'%Y-%m-%d') != DATE(now())";

async function insertCategoriInfo(params) {
  let con;
  try {
    con = await pool.getConnection();
    const result = await con.query(insertCategoriInfoSql, params);
    con.commit();
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (con) con.release();
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
    if (con) con.release(); 
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
    if (conn) conn.release();
  }
  return list;
}
async function selectCHPList() {
  let conn;
  let list = [];
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM CRAWLING_HREF_PATTERN");
    for (let i = 0; i < rows.length; i++) {
      list.push(rows[i]);
    }
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
  return list;
}
var dao = {
  insertCrawlingInfo: insertCategoriInfo,
  selectShopInfo: selectShopInfo,
  deleteCrawlingInfo: deleteCrawlingInfo,
  selectCHPList:selectCHPList
  // selectCHPList:selectCHPList
}
module.exports = dao;