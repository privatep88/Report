
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-gray-300 no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
                    {/* About Section */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold text-white mb-2">عن SAHER</h3>
                        <div className="w-12 h-0.5 bg-yellow-400 mb-4"></div>
                        <p className="text-sm leading-relaxed">
                            شركة رائدة في تقديم الحلول والأنظمة الذكية، ملتزمون بالابتكار والجودة لتحقيق أعلى مستويات الكفاءة والخدمات الذكية.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">روابط سريعة</h3>
                        <div className="w-12 h-0.5 bg-yellow-400 mb-4"></div>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors duration-300">الرئيسية</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">خدماتنا</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">تواصل معنا</a></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">تواصل معنا</h3>
                        <div className="w-12 h-0.5 bg-yellow-400 mb-4"></div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Level 3, Baynona Building, Khalif City A</span>
                            </li>
                            <li className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="whitespace-nowrap" dir="ltr">+971 4 123 4567</span>
                            </li>
                            <li className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:Logistic@saher.ae" className="hover:text-white transition-colors duration-300">Logistic@saher.ae</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col items-center text-sm text-gray-400 pb-8">
                    <p> اعداد وتصميم / خالد الجفري</p>
                    <p className="mt-2">جميع الحقوق محفوظة لشركة © {new Date().getFullYear()} SAHER FOR SMART SERVICES</p>
                </div>
            </div>
        </footer>
    );
};
