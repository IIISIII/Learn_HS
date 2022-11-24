import React from "react";
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';

// If you use the default popups, use this.
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

class AssignCal extends React.Component {
    constructor(props) {
        super(props);
        this.calendarRef = React.createRef();
    }
  
    // ---------- Instance method ---------- //

    // 다음 주로 이동하는 버튼
    handleClickNextButton = () => {
        const calendarInstance = this.calendarRef.current.getInstance();
  
        calendarInstance.next();
    };

    // 한 주 스케줄 보기    ( defaultView = month 로 수정해놓았습니다 )
    weekChangeButton = () => {
        const calendarInstance = this.calendarRef.current.getInstance();

        calendarInstance.changeView('week', true);
    }


    // ---------- Event ---------- //

    // week 상태에서 요일 클릭

    beforeCreateSchedule = (ev) => {
        console.group('onbeforeCreateSchedule');
        console.log(ev.date);
        console.groupEnd();
        
    }

    render() {
        const selectedView = 'month';     // default view
          
        return (
          <>
            <div style={{marginLeft:"15%", marginRight:"15%", marginTop:"20px", border:"1px solid #dddddd"}}>
            <Calendar
                ref={this.calendarRef}
                onClickDayname={this.handleClickDayname}
                onbeforeCreateSchedule={this.beforeCreateSchedule}
                height="600px"
                
                calendars={[

                ]}
                disableDblClick={true}
                disableClick={false}
                isReadOnly={false}
                schedules={[

                ]}
                scheduleView
                taskView
                template={{
                  milestone(schedule) {
                    return `<span style="color:#fff;background-color: ${schedule.bgColor};">${
                      schedule.title
                    }</span>`;
                  },
                  milestoneTitle() {
                    return 'Milestone';
                  },
                  allday(schedule) {
                    return `${schedule.title}<i class="fa fa-refresh"></i>`;
                  },
                  alldayTitle() {
                    return 'All Day';
                  }
                }}
                theme='' // 어두운 테마 사용가능
                timezones={[
                  {
                    timezoneOffset: 540,
                    displayLabel: 'GMT+09:00',
                    tooltip: 'Seoul'
                  }
                ]}
                useDetailPopup
                useCreationPopup
                view={selectedView} // You can also set the `defaultView` option.

                month={{
                  daynames: ['일', '월', '화', '수', '목', '금', '토']
                  //narrowWeekend: true // 토, 일은 사이즈 작게
                }}
            />
            <button onClick={this.handleClickNextButton}>Go next!</button>
            </div>
          </>
        );
    }
}

export default AssignCal;
