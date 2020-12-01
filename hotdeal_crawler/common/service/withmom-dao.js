const mariadb = require('mariadb');
const dbInfo = require('./db-info.js.js.js');
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

/***************** CRAWLING_CATE(CCI) *****************/
const selectCCPListSql = 'SELECT * FROM CRAWLING_CATE_PATTERN WHERE CSP_NUM = '
async function selectCCPList(cspNum) {
  let conn;
  let list = [];
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(selectCCPListSql + cspNum);
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

const insertCCISql = 'INSERT INTO CRAWLING_CATE_INFO(CSP_NUM, CCI_PARENT_NUM, CCI_KEY, CCI_URI, CCI_NAME, CREDAT, CRETIM, CREUSR, MODDAT, MODTIM, MODUSR, ACTIVE)'
  + ' VALUES (?, ?, ?, ?, ?, DATE_FORMAT(NOW(),\'%Y%m%d\'), DATE_FORMAT(NOW(),\'%H%i%S\'), ?, DATE_FORMAT(NOW(),\'%Y%m%d\'), DATE_FORMAT(NOW(),\'%H%i%S\'), ?, ?)';
async function insertCCI(params) {
  let con;
  try {
    con = await pool.getConnection();
    const result = await con.query(insertCCISql, params);
    con.commit();
    return result;
  } catch (err) {
    let errorLog = '';
    switch (err['code']) {
      case 'ER_PARAMETER_UNDEFINED':
        errorLog = 'Selector Not Found : Category';
        break;
      case 'ER_DUP_ENTRY':
        errorLog = 'Duplicated Value : Category';
        break;
    }

    // # failParams = [CSP_NUM, CCI_NUM(null), CSF_ERROR_MSG, CSF_ERROR_DESC, CREUSR, MODUSR, ACTIVE]
    let failParams = [[params[0]], null, err, errorLog, [params[5]], [params[6]], [params[7]]];
    insertCSF(failParams)

    throw err;
  } finally {
    if (con) con.release();
  }
}

/***************** CRAWLING_GOODS(CGI) *****************/
const insertCGISql = 'INSERT INTO CRAWLING_GOODS_INFO(CSP_NUM, CCI_NUM, CGI_KEY, CGI_URI, CGI_NAME, CGI_DESC, CGI_PRICE, CGI_DISPRICE, CGI_SIMG_NAME, CGI_MIMG_NAME, CREDAT, CRETIM, CREUSR, MODDAT, MODTIM, MODUSR, ACTIVE)'
  + ' values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_FORMAT(NOW(),\'%Y%m%d\'), DATE_FORMAT(NOW(),\'%H%i%S\'), ?, DATE_FORMAT(NOW(),\'%Y%m%d\'), DATE_FORMAT(NOW(),\'%H%i%S\'), ?, ?)';
async function insertCGI(params) {
  let con;
  try {
    con = await pool.getConnection();
    const result = await con.query(insertCGISql, params);
    con.commit();
    return result;
  } catch (err) {
    let errorLog = '';
    switch (err['code']) {
      case 'ER_PARAMETER_UNDEFINED':
        errorLog = 'Selector Not Found : Goods';
        break;
      case 'ER_DUP_ENTRY':
        errorLog = 'Duplicated Value : Goods';
        break;
    }

    // # failParams = [CSP_NUM, CCI_NUM, CSF_ERROR_MSG, CSF_ERROR_DESC, CREUSR, MODUSR, ACTIVE]
    let failParams = [[params[0]], [params[1]], err, errorLog, [params[10]], [params[11]], [params[12]]];
    insertCSF(failParams);

    throw err;
  } finally {
    if (con) con.release();
  }
}

/***************** CRAWLING_SHOP(CSP,CSF) *****************/
const selectCSPListSql = 'SELECT * FROM CRAWLING_SHOP_PATTERN WHERE ACTIVE = 1'
async function selectCSPList() {
  let conn;
  let list = [];
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(selectCSPListSql);
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

const insertCSFSql = 'INSERT INTO CRAWLING_SHOP_FAIL(CSP_NUM, CCI_NUM, CSF_ERROR_MSG, CSF_ERROR_DESC, CREDAT, CRETIM, CREUSR, MODDAT, MODTIM, MODUSR, ACTIVE)'
  + ' values (?, ?, ?, ?, DATE_FORMAT(NOW(),\'%Y%m%d\'), DATE_FORMAT(NOW(),\'%H%i%S\'), ?, DATE_FORMAT(NOW(),\'%Y%m%d\'), DATE_FORMAT(NOW(),\'%H%i%S\'), ?, ?)';
async function insertCSF(params) {
  let con;
  try {
    con = await pool.getConnection();
    const result = await con.query(insertCSFSql, params);
    con.commit();
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (con) con.release();
  }
}

const selectCSPSql = 'SELECT * FROM CRAWLING_SHOP_PATTERN WHERE CSP_NUM = ';
async function selectCSP(cspNum) {
  let conn;
  let resObj = {};
  try {
    conn = await pool.getConnection();
    const row = await conn.query(selectCSPSql + cspNum);
    resObj = row;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
  return resObj[0];
}

var dao = {
  // Select
  selectCSP: selectCSP,
  selectCHPList: selectCHPList,
  selectCCPList: selectCCPList,
  selectCSPList: selectCSPList,
  // Insert
  insertCHI: insertCHI,
  insertCCI: insertCCI,
  insertCGI: insertCGI,
  insertCSF: insertCSF
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