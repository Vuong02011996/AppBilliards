import moment from 'moment';
import unidecode from 'unidecode';
import {convertMinutesToTimeString} from './command';

export const getData = (
  gioVao,
  gioNghi,
  thoiGianChoi,
  tableId,
  menuItems,
  tienMenu,
  tienGio,
  giamGia,
  tienGioConLai,
  tienGioMoiPhut,
  tongTien,
) => {
  const thoiGianChoiConvert = convertMinutesToTimeString(thoiGianChoi);
  console.log('gioVao: ', gioVao);
  let gioVaoConvert = gioVao;
  let gioNghiConvert = gioNghi;
  if (gioVao === 'Chưa đặt') {
    gioVaoConvert = '';
  } else {
    gioVaoConvert = convertDay(gioVaoConvert);
  }
  if (gioNghi === 'Chưa thanh toán') {
    gioNghiConvert = '';
  } else {
    gioNghiConvert = convertDay(gioNghiConvert);
  }
  let tenMon;

  const data = `
          ---------------------------------
          \x1B\x45\x01          BIDA HVK\x1B\x45\x00
          Tinh Phong, Son Tinh, Quang Ngai
          ---------------------------------
              PHIEU THANH TOAN
              Ban: ${tableId}

          Mat hang: 
          ---------------------------------
          Ten      SoLuong   Gia   ThanhTien
          ${menuItems
            .map((item, index) => {
              tenMon = unidecode(item.TenMon);
              tenMon = tenMon.padEnd(13, ' ');

              let soLuong = item.soLuong;
              soLuong = soLuong.toString().padEnd(2, ' ');

              let gia = item.Gia;
              gia = gia.toString().padEnd(4, ' ');
              let thanh_tien = soLuong * gia;

              if (index === 0) {
                return `${tenMon}${soLuong}     ${gia}   ${thanh_tien} 000d\n`;
              }

              return `          ${tenMon}${soLuong}     ${gia}   ${thanh_tien} 000d\n`;
            })
            .join('')}
          Tien menu:    ${tienMenu} 000d
          ---------------------------------

          Thoi gian vao: ${gioVaoConvert}
          Thoi gian ra: ${gioNghiConvert}
          Thoi gian choi:   ${thoiGianChoiConvert}

          Tien gio:  ${tienGio} 000d   (${Math.round(tienGioMoiPhut * 60)}d/Gio)
          Giam gia: ${tienGioConLai} 000d   (${giamGia}%)

          \x1B\x45\x01TONG CONG:  ${tongTien} 000d\x1B\x45\x00
          Cam on quy khach! Hen gap lai!
          ---------------------------------
          




        






          `;

  // console.log(data);
  return data;
};

const convertDay = originalDate => {
  //   const originalDate = '10:29:52, 12/5/2023';
  const formattedDateTime = moment(originalDate, 'HH:mm:ss, DD/M/YYYY').format(
    'HH:mm, DD/M/YYYY',
  );

  return formattedDateTime;
};
