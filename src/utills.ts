
const formatDuration = (createdAt: string): string => {
    const createdAtDate = new Date(createdAt);
    const now = new Date();
    
    // แปลงเป็นเวลาของประเทศไทย (GMT+7)
    const timezoneOffset = 7 * 60; // 7 ชั่วโมง * 60 นาที
    const offsetMilliseconds = timezoneOffset * 60 * 1000;
  
    const createdAtThailand = createdAtDate.getTime() + 7 * 60 * 60 * 1000;
    const nowThailand = new Date(now.getTime());
  
    let difference = nowThailand.getTime() - createdAtThailand;
  
    const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
    difference -= years * 1000 * 60 * 60 * 24 * 365;
    const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
    difference -= months * 1000 * 60 * 60 * 24 * 30;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    difference -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(difference / (1000 * 60 * 60));
    difference -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(difference / (1000 * 60));
    difference -= minutes * 1000 * 60;
    const seconds = Math.floor(difference / 1000);
  
    // console.log(years, months, days, hours, minutes, seconds);
  
    let result = "";
    if (years > 0) result += `${years} year${years > 1 ? 's' : ''} `;
    if (months > 0) result += `${months} month${months > 1 ? 's' : ''} `;
    if (days > 0) result += `${days} day${days > 1 ? 's' : ''} `;
    if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''} `;
    if (minutes > 0) result += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    if (seconds > 0) result += `${seconds} second${seconds > 1 ? 's' : ''}`;
  
    return result.trim();
}


const TimePeriodComponent = () => {
    const period = new Date().getHours();
    const timePeriod =
      period >= 5 && period < 9
        ? 'ตอนเช้า'
        : period >= 9 && period < 12
        ? 'ตอนสาย'
        : period >= 12 && period < 13
        ? 'ตอนเที่ยง'
        : period >= 13 && period < 17
        ? 'ตอนบ่าย'
        : period >= 17 && period < 19
        ? 'ตอนเย็น'
        : period >= 19 && period < 21
        ? 'ตอนค่ำ'
        : 'ตอนดึก';
  
    return timePeriod;
  };

export {
    formatDuration,
    TimePeriodComponent
}