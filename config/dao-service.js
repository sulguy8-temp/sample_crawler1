const mariadb = require('mariadb');
const dbInfo = require('./db-info.js');
const pool = mariadb.createPool(dbInfo);

/***************** CRAWLING_HREF(CHI,CHP,CHF) *****************/
const selectCHIListSql = 'SELECT * FROM CRAWLING_HREF_PATTERN'
async function selectCHPList() {
  let conn;
  let list = [];
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(selectCHIListSql);
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

const insertCHISql = 'INSERT INTO CRAWLING_HREF_INFO(CHP_NUM, CHI_URL, CHI_SELLER, CHI_GOODS, CHI_PRICE, CHI_IMG_NAME, CREDAT, CRETIM, CREUSR, MODDAT, MODTIM, MODUSR, ACTIVE)'
  + ' values (?, ?, ?, ?, ?, ?, DATE_FORMAT(NOW(),\'%Y%m%d\'), DATE_FORMAT(NOW(),\'%H%i%S\'), ?, DATE_FORMAT(NOW(),\'%Y%m%d\'), DATE_FORMAT(NOW(),\'%H%i%S\'), ?, ?)';
async function insertCHI(params) {
  let con;
  try {
    con = await pool.getConnection();
    const result = await con.query(insertCHISql, params);
    con.commit();
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (con) con.release();
  }
}

/***************** CRAWLING_CATE(CRC) *****************/
const insertCRCSql = 'INSERT INTO crawling_category(SHI_NUM, CRC_CATEGORY_NAME, CRC_CATEGORY_URL, CRC_SELECTOR, CRC_PATTERN)'
  + ' values (?, ?, ?, ?, ?)';
async function insertCRC(params) {
  let con;
  try {
    con = await pool.getConnection();
    const result = await con.query(insertCRCSql, params);
    con.commit();
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (con) con.release();
  }
}

/***************** CRAWLING_GOODS(CRG) *****************/
const insertCRGSql = 'INSERT INTO crawling_goods(SHI_NUM, CRG_NAME, CRG_PRICE, CRG_DISPRICE, CRG_S_IMG, CRG_M_IMG)'
  + ' values (?, ?, ?, ?, ?, ?)';
async function insertCRG(params) {
  let con;
  try {
    con = await pool.getConnection();
    const result = await con.query(insertCRGSql, params);
    con.commit();
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (con) con.release();
  }
}

/***************** CRAWLING_SHOP(CSP,CSF) *****************/
const selectCSPSql = 'SELECT * FROM shop_info WHERE SHI_NUM = ';
async function selectCSP(shiNum) {
  let conn;
  let resObj = {};
  try {
    conn = await pool.getConnection();
    const row = await conn.query(selectCSPSql + shiNum);
    resObj = row;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
  return resObj[0];
}



var dao = {
  selectCSP: selectCSP,
  selectCHPList: selectCHPList,

  insertCHI: insertCHI,
  insertCRC: insertCRC,
  insertCRG: insertCRG
}
module.exports = dao;
















// const deleteSql = "DELETE FROM crawling_info WHERE DATE_FORMAT(credat,'%Y-%m-%d') != DATE(now())";
// async function deleteCrawlingInfo() {
//   let con;
//   try {
//     con = await pool.getConnection();
//     const result = await con.query(deleteSql);
//     con.commit();
//     return result;
//   } catch (err) {
//     throw err;
//   } finally {
//     if (con) con.release();
//   }
// }
// async function selectShopInfo() {
//   let conn;
//   let list = [];
//   try {
//     conn = await pool.getConnection();
//     const rows = await conn.query("SELECT SHI_NUM,SHI_CRAWLING_WORD from shop_info where SHI_CRAWLING_WORD IS NOT NULL");
//     for (let i = 0; i < rows.length; i++) {
//       list.push(rows[i]);
//     }
//   } catch (err) {
//     throw err;
//   } finally {
//     if (conn) conn.release();
//   }
//   return list;
// }