import React from 'react';

const Calendar = (): React.JSX.Element => {
	return (
			<div className="min-h-[calc(100vh-84px)] text-[#1A1A2E]">
				<div className="flex min-h-[640px] border border-[#E5E7EB] bg-white rounded-xl overflow-hidden">
					<aside className="w-[240px] border-r border-[#E5E7EB] p-4 flex flex-col gap-8 bg-white">
						<div className="mini-calendar">
						<div className="flex items-center justify-between mb-4 px-2">
							<h4 className="text-[15px] font-bold">Tháng 10 2024</h4>
							<div className="flex gap-2">
								<span className="material-symbols-outlined text-[#6B7280] cursor-pointer hover:text-[#4F3CC9]">
									chevron_left
								</span>
								<span className="material-symbols-outlined text-[#6B7280] cursor-pointer hover:text-[#4F3CC9]">
									chevron_right
								</span>
							</div>
						</div>
						<div className="grid grid-cols-7 text-center gap-y-2">
							<div className="text-[12px] font-medium text-[#6B7280] opacity-60">T2</div>
							<div className="text-[12px] font-medium text-[#6B7280] opacity-60">T3</div>
							<div className="text-[12px] font-medium text-[#6B7280] opacity-60">T4</div>
							<div className="text-[12px] font-medium text-[#6B7280] opacity-60">T5</div>
							<div className="text-[12px] font-medium text-[#6B7280] opacity-60">T6</div>
							<div className="text-[12px] font-medium text-[#6B7280] opacity-60">T7</div>
							<div className="text-[12px] font-medium text-[#6B7280] opacity-60 text-[#EF4444]">CN</div>
							<div className="py-1 text-[14px] text-[#6B7280] opacity-30">26</div>
							<div className="py-1 text-[14px] text-[#6B7280] opacity-30">27</div>
							<div className="py-1 text-[14px] text-[#6B7280] opacity-30">28</div>
							<div className="py-1 text-[14px] text-[#6B7280] opacity-30">29</div>
							<div className="py-1 text-[14px] text-[#6B7280] opacity-30">30</div>
							<div className="py-1 text-[14px]">1</div>
							<div className="py-1 text-[14px]">2</div>
							<div className="py-1 text-[14px] relative">
								3
								<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#4F3CC9] rounded-full"></div>
							</div>
							<div className="py-1 text-[14px]">4</div>
							<div className="py-1 text-[14px] bg-[#4F3CC9] text-white rounded-full">5</div>
							<div className="py-1 text-[14px] relative">
								6
								<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#F59E0B] rounded-full"></div>
							</div>
							<div className="py-1 text-[14px]">7</div>
							<div className="py-1 text-[14px]">8</div>
							<div className="py-1 text-[14px]">9</div>
						</div>
					</div>
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h4 className="text-[15px] font-bold">Việc chưa xếp lịch</h4>
							<span className="text-[12px] font-bold text-[#6B7280] bg-[#F6F2FE] px-2 rounded">
								4
							</span>
						</div>
						<div className="flex flex-col gap-3">
							<div className="p-3 bg-white border border-[#E5E7EB] rounded-lg hover:border-[#EDE9FF] transition-colors group cursor-grab">
								<div className="flex items-center gap-2 mb-2">
									<span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
									<span className="text-[11px] font-semibold text-[#7C3AED] uppercase">Thiết kế UI</span>
								</div>
								<p className="text-[14px]">Xem lại bento grid</p>
							</div>
							<div className="p-3 bg-white border border-[#E5E7EB] rounded-lg hover:border-[#EDE9FF] transition-colors group cursor-grab">
								<div className="flex items-center gap-2 mb-2">
									<span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
									<span className="text-[11px] font-semibold text-[#F59E0B] uppercase">Vận hành</span>
								</div>
								<p className="text-[14px]">Gửi báo cáo tháng</p>
							</div>
						</div>
					</div>
					</aside>

					<section className="flex-1 overflow-y-auto bg-white relative">
					<div className="sticky top-0 bg-white z-30 px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[15px] font-medium hover:bg-[#F6F2FE] transition-colors"
								type="button"
							>
								Hôm nay
							</button>
							<div className="flex items-center">
								<span className="material-symbols-outlined text-[#6B7280] cursor-pointer p-2 hover:bg-[#F6F2FE] rounded-full">
									chevron_left
								</span>
								<span className="material-symbols-outlined text-[#6B7280] cursor-pointer p-2 hover:bg-[#F6F2FE] rounded-full">
									chevron_right
								</span>
							</div>
							<h2 className="text-[18px] font-semibold ml-2">20 - 26 Tháng 10, 2024</h2>
						</div>
						<div className="flex bg-[#F6F2FE] p-1 rounded-xl">
							<button className="px-4 py-2 text-[12px] font-medium text-[#6B7280] rounded-lg" type="button">
								Ngày
							</button>
							<button
								className="px-4 py-2 text-[12px] bg-white text-[#4F3CC9] shadow-sm rounded-lg font-bold"
								type="button"
							>
								Tuần
							</button>
							<button className="px-4 py-2 text-[12px] font-medium text-[#6B7280] rounded-lg" type="button">
								Tháng
							</button>
						</div>
					</div>
					<div className="grid grid-cols-[60px_repeat(7,_minmax(0,_1fr))]">
						<div className="h-12 border-b border-[#E5E7EB]"></div>
						<div className="h-12 border-b border-r border-[#E5E7EB] flex flex-col items-center justify-center">
							<span className="text-[12px] font-medium text-[#6B7280]">T2</span>
							<span className="text-[15px] font-medium">20</span>
						</div>
						<div className="h-12 border-b border-r border-[#E5E7EB] flex flex-col items-center justify-center">
							<span className="text-[12px] font-medium text-[#6B7280]">T3</span>
							<span className="text-[15px] font-medium">21</span>
						</div>
						<div className="h-12 border-b border-r border-[#E5E7EB] flex flex-col items-center justify-center bg-[#EDE9FF]/20">
							<span className="text-[12px] font-bold text-[#4F3CC9]">T4</span>
							<span className="text-[15px] font-medium bg-[#4F3CC9] text-white w-7 h-7 flex items-center justify-center rounded-full">
								22
							</span>
						</div>
						<div className="h-12 border-b border-r border-[#E5E7EB] flex flex-col items-center justify-center">
							<span className="text-[12px] font-medium text-[#6B7280]">T5</span>
							<span className="text-[15px] font-medium">23</span>
						</div>
						<div className="h-12 border-b border-r border-[#E5E7EB] flex flex-col items-center justify-center">
							<span className="text-[12px] font-medium text-[#6B7280]">T6</span>
							<span className="text-[15px] font-medium">24</span>
						</div>
						<div className="h-12 border-b border-r border-[#E5E7EB] flex flex-col items-center justify-center">
							<span className="text-[12px] font-medium text-[#6B7280]">T7</span>
							<span className="text-[15px] font-medium">25</span>
						</div>
						<div className="h-12 border-b border-[#E5E7EB] flex flex-col items-center justify-center">
							<span className="text-[12px] font-medium text-[#6B7280]">CN</span>
							<span className="text-[15px] font-medium">26</span>
						</div>

						<div className="h-16 border-b border-[#E5E7EB] flex items-start justify-center pt-2 text-[12px] font-medium text-[#6B7280]">
							08:00
						</div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB] bg-[#EDE9FF]/10"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-[#E5E7EB]"></div>

						<div className="h-16 border-b border-[#E5E7EB] flex items-start justify-center pt-2 text-[12px] font-medium text-[#6B7280]">
							09:00
						</div>
						<div className="h-16 border-b border-r border-[#E5E7EB]">
							<div className="mx-1 mt-2 bg-[#EDE9FF] border-l-4 border-[#4F3CC9] p-2 rounded-lg h-[120px] relative z-10 shadow-sm">
								<h5 className="text-[12px] font-bold text-[#3A2D9E]">Họp Sprint</h5>
								<p className="text-[10px] text-[#5B4CDB]">09:00 - 11:00</p>
							</div>
						</div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB] bg-[#EDE9FF]/10 relative">
							<div className="absolute top-1/2 left-0 w-full flex items-center z-20">
								<div className="w-2 h-2 bg-[#EF4444] rounded-full -ml-1"></div>
								<div className="flex-1 h-[2px] bg-[#EF4444]"></div>
							</div>
						</div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]">
							<div className="mx-1 mt-4 bg-amber-50 border-l-4 border-[#F59E0B] p-2 rounded-lg h-[60px] relative z-10 shadow-sm">
								<h5 className="text-[12px] font-bold text-[#F59E0B]">Review Code</h5>
							</div>
						</div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-[#E5E7EB]"></div>

						<div className="h-16 border-b border-[#E5E7EB] flex items-start justify-center pt-2 text-[12px] font-medium text-[#6B7280]">
							10:00
						</div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB] bg-[#EDE9FF]/10"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-[#E5E7EB]"></div>

						<div className="h-16 border-b border-[#E5E7EB] flex items-start justify-center pt-2 text-[12px] font-medium text-[#6B7280]">
							11:00
						</div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB] bg-[#EDE9FF]/10"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-[#E5E7EB]"></div>

						<div className="h-16 border-b border-[#E5E7EB] flex items-start justify-center pt-2 text-[12px] font-medium text-[#6B7280]">
							12:00
						</div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB] bg-[#EDE9FF]/10"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-[#E5E7EB]"></div>

						<div className="h-16 border-b border-[#E5E7EB] flex items-start justify-center pt-2 text-[12px] font-medium text-[#6B7280]">
							13:00
						</div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB] bg-[#EDE9FF]/10"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-[#E5E7EB]"></div>

						<div className="h-16 border-b border-[#E5E7EB] flex items-start justify-center pt-2 text-[12px] font-medium text-[#6B7280]">
							14:00
						</div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB] bg-[#EDE9FF]/10"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-[#E5E7EB]"></div>

						<div className="h-16 border-b border-[#E5E7EB] flex items-start justify-center pt-2 text-[12px] font-medium text-[#6B7280]">
							15:00
						</div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB] bg-[#EDE9FF]/10"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-r border-[#E5E7EB]"></div>
						<div className="h-16 border-b border-[#E5E7EB]"></div>
					</div>

					</section>

					<aside className="w-[220px] bg-[#F5F4FA] p-4 flex flex-col gap-6 overflow-y-auto">
					
					</aside>
				</div>
		</div>
	);
};

export default Calendar;
