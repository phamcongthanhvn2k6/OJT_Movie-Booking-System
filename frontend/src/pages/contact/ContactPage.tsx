import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API feedback submission
    setIsSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020d18] text-white">
      <Header />
      <main className="grow py-12 px-4 md:px-20 max-w-7xl mx-auto w-full">
        
        {/* Title */}
        <div className="flex items-center gap-2 mb-10 border-l-4 border-red-600 pl-4">
          <h1 className="text-3xl font-bold uppercase tracking-wide">Liên hệ với chúng tôi</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Column 1: Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 md:p-8 shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-red-500 border-b border-gray-800 pb-3">Thông tin liên lạc</h2>
              
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white text-sm uppercase">Địa chỉ</h3>
                  <p className="text-sm text-gray-400 mt-1">87 Láng Hạ, Quận Ba Đình, Tp. Hà Nội</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white text-sm uppercase">Điện thoại</h3>
                  <p className="text-sm text-gray-400 mt-1">024.35141791</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white text-sm uppercase">Email</h3>
                  <p className="text-sm text-gray-400 mt-1">support@ncc.gov.vn</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white text-sm uppercase">Giờ làm việc</h3>
                  <p className="text-sm text-gray-400 mt-1">8:00 AM - 10:30 PM (Tất cả các ngày trong tuần)</p>
                </div>
              </div>
            </div>

            {/* Embed Map Card */}
            <div className="bg-[#0f172a] border border-gray-800 rounded-xl overflow-hidden shadow-xl h-64">
              {/* Simulated Map Widget */}
              <iframe
                title="Bản đồ Trung tâm Chiếu phim Quốc gia"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.3785232924195!2d105.81321037588383!3d21.017533880629088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab7dc40b5f51%3A0xe5433d9c7df6c6c4!2zVHJ1bmcgdMOibSBDaGnhur91IHBoaW0gUXXhu5FjIGdpYQ!5e0!3m2!1svi!2s!4v1689000000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Column 2: Feedback Form */}
          <div className="lg:col-span-7 bg-[#0f172a] border border-gray-800 rounded-xl p-6 md:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-red-500 border-b border-gray-800 pb-3 mb-6">Gửi thư đóng góp ý kiến</h2>
            
            {isSent && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg text-sm mb-6 animate-pulse">
                Cảm ơn bạn đã gửi ý kiến đóng góp! Chúng tôi sẽ phản hồi lại bạn sớm nhất có thể.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase">Họ và Tên</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 outline-none text-white text-sm focus:border-red-600 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase">Địa chỉ Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nguyenvana@gmail.com"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 outline-none text-white text-sm focus:border-red-600 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="text-xs font-bold text-gray-400 uppercase">Tiêu đề</label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Góp ý về dịch vụ/sự cố..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 outline-none text-white text-sm focus:border-red-600 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-bold text-gray-400 uppercase">Nội dung thư</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Viết ý kiến đóng góp của bạn tại đây..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 outline-none text-white text-sm focus:border-red-600 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-lg font-bold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Gửi phản hồi
              </button>
            </form>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
