import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { TicketPriceContent } from "./component/TicketPriceContent";

export const TicketPrice = () => {
  return (
    <div className=" bg-gray-900 text-white min-h-screen w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4">
        <Header />

        <main>
          <div className="text-center mt-[48px] mb-[24px]">
            <p className="font-bold text-[24px] leading-8">Giá Vé</p>
            <p className="font-normal text-[16px] leading-6">
              (Áp dụng từ ngày 01/06/2023)
            </p>
          </div>

          {/* Giá phim 2D */}
          <p className="font-[600] text-[18px] leading-7 mb-3">
            1. GIÁ VÉ XEM PHIM 2D
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-gray-700 border-collapse text-sm text-center bg-gray-900 text-gray-300 [&_th]:border [&_th]:border-gray-700 [&_td]:border [&_td]:border-gray-700">
              <thead>
                <tr className="border-b border-gray-700">
                  <th></th>
                  <th colSpan={3} className="p-4">
                    Từ thứ 2 đến thứ 5
                    <div className="text-xs text-gray-400">
                      From Monday to Thursday
                    </div>
                  </th>
                  <th colSpan={3} className="p-4">
                    Thứ 6, 7, CN và ngày Lễ
                    <div className="text-xs text-gray-400">
                      Friday, Saturday, Sunday & public holiday
                    </div>
                  </th>
                </tr>

                <tr className="border-b border-gray-700">
                  <th className="p-4 text-left">Thời gian</th>
                  <th>
                    Ghế thường
                    <br />
                    Standard
                  </th>
                  <th className="text-yellow-400">
                    Ghế VIP
                    <br />
                    VIP
                  </th>
                  <th className="text-red-500">
                    Ghế đôi
                    <br />
                    Sweetbox
                  </th>
                  <th>
                    Ghế thường
                    <br />
                    Standard
                  </th>
                  <th className="text-yellow-400">
                    Ghế VIP
                    <br />
                    VIP
                  </th>
                  <th className="text-red-500">
                    Ghế đôi
                    <br />
                    Sweetbox
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-left">
                    Trước 12PM
                    <br />
                    <span className="text-xs text-gray-400">Before 12PM</span>
                  </td>
                  <td>55.000đ</td>
                  <td className="text-yellow-400">65.000đ</td>
                  <td className="text-red-500">140.000đ</td>
                  <td>70.000đ</td>
                  <td className="text-yellow-400">80.000đ</td>
                  <td className="text-red-500">170.000đ</td>
                </tr>

                <tr className="border-b border-gray-800">
                  <td className="p-4 text-left">
                    Từ 12PM đến trước 17:00
                    <br />
                    <span className="text-xs text-gray-400">
                      From 5PM to before 11:00PM
                    </span>
                  </td>
                  <td>70.000đ</td>
                  <td className="text-yellow-400">75.000đ</td>
                  <td className="text-red-500">160.000đ</td>
                  <td>80.000đ</td>
                  <td className="text-yellow-400">85.000đ</td>
                  <td className="text-red-500">180.000đ</td>
                </tr>

                <tr className="border-b border-gray-800">
                  <td className="p-4 text-left">
                    Từ 17:00 đến trước 23:00
                    <br />
                    <span className="text-xs text-gray-400">
                      From 5PM to before 11:00PM
                    </span>
                  </td>
                  <td>80.000đ</td>
                  <td className="text-yellow-400">85.000đ</td>
                  <td className="text-red-500">180.000đ</td>
                  <td>90.000đ</td>
                  <td className="text-yellow-400">95.000đ</td>
                  <td className="text-red-500">200.000đ</td>
                </tr>

                <tr>
                  <td className="p-4 text-left">
                    Từ 23:00
                    <br />
                    <span className="text-xs text-gray-400">From 11:00PM</span>
                  </td>
                  <td>65.000đ</td>
                  <td className="text-yellow-400">70.000đ</td>
                  <td className="text-red-500">150.000đ</td>
                  <td>75.000đ</td>
                  <td className="text-yellow-400">80.000đ</td>
                  <td className="text-red-500">170.000đ</td>
                </tr>
              </tbody>
            </table>
            <p className="font-[400] text-[14px] text-[#94A3B8] leading-5 mt-3">* Đối với phim có thời lượng từ 150 phút trở lên: phụ thu 10.000 VNĐ / vé </p>
          </div>

          {/* Giá phim 3D */}
          <p className="font-[600] text-[18px] leading-7 mb-3 mt-6">
            1. GIÁ VÉ XEM PHIM 3D
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-gray-700 border-collapse text-sm text-center bg-gray-900 text-gray-300 [&_th]:border [&_th]:border-gray-700 [&_td]:border [&_td]:border-gray-700">
              <thead>
                <tr className="border-b border-gray-700">
                  <th></th>
                  <th colSpan={3} className="p-4">
                    Từ thứ 2 đến thứ 5
                    <div className="text-xs text-gray-400">
                      From Monday to Thursday
                    </div>
                  </th>
                  <th colSpan={3} className="p-4">
                    Thứ 6, 7, CN và ngày Lễ
                    <div className="text-xs text-gray-400">
                      Friday, Saturday, Sunday & public holiday
                    </div>
                  </th>
                </tr>

                <tr className="border-b border-gray-700">
                  <th className="p-4 text-left">Thời gian</th>
                  <th>
                    Ghế thường
                    <br />
                    Standard
                  </th>
                  <th className="text-yellow-400">
                    Ghế VIP
                    <br />
                    VIP
                  </th>
                  <th className="text-red-500">
                    Ghế đôi
                    <br />
                    Sweetbox
                  </th>
                  <th>
                    Ghế thường
                    <br />
                    Standard
                  </th>
                  <th className="text-yellow-400">
                    Ghế VIP
                    <br />
                    VIP
                  </th>
                  <th className="text-red-500">
                    Ghế đôi
                    <br />
                    Sweetbox
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-left">
                    Trước 12PM
                    <br />
                    <span className="text-xs text-gray-400">Before 12PM</span>
                  </td>
                  <td>60.000đ</td>
                  <td className="text-yellow-400">80.000đ</td>
                  <td className="text-red-500">160.000đ</td>
                  <td>80.000đ</td>
                  <td className="text-yellow-400">100.000đ</td>
                  <td className="text-red-500">200.000đ</td>
                </tr>

                <tr className="border-b border-gray-800">
                  <td className="p-4 text-left">
                    Từ 12PM đến trước 17:00
                    <br />
                    <span className="text-xs text-gray-400">
                      From 5PM to before 11:00PM
                    </span>
                  </td>
                  <td>80.000đ</td>
                  <td className="text-yellow-400">90.000đ</td>
                  <td className="text-red-500">180.000đ</td>
                  <td>100.000đ</td>
                  <td className="text-yellow-400">110.000đ</td>
                  <td className="text-red-500">220.000đ</td>
                </tr>

                <tr className="border-b border-gray-800">
                  <td className="p-4 text-left">
                    Từ 17:00 đến trước 23:00
                    <br />
                    <span className="text-xs text-gray-400">
                      From 5PM to before 11:00PM
                    </span>
                  </td>
                  <td>100.000đ</td>
                  <td className="text-yellow-400">110.000đ</td>
                  <td className="text-red-500">2200.000đ</td>
                  <td>130.000đ</td>
                  <td className="text-yellow-400">140.000đ</td>
                  <td className="text-red-500">280.000đ</td>
                </tr>

                <tr>
                  <td className="p-4 text-left">
                    Từ 23:00
                    <br />
                    <span className="text-xs text-gray-400">From 11:00PM</span>
                  </td>
                  <td>100.000đ</td>
                  <td className="text-yellow-400">110.000đ</td>
                  <td className="text-red-500">220.000đ</td>
                  <td>120.000đ</td>
                  <td className="text-yellow-400">130.000đ</td>
                  <td className="text-red-500">260.000đ</td>
                </tr>
              </tbody>
            </table>
            <p className="font-[400] text-[14px] text-[#94A3B8] leading-5 mt-3">* Đối với phim có thời lượng từ 150 phút trở lên: phụ thu 10.000 VNĐ / vé </p>
          </div>

          {/* content */}
          <TicketPriceContent/>
        </main>

        <Footer />
      </div>
    </div>
  );
};
