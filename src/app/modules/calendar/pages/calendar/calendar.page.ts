import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.page.html'
})
export class CalendarPage implements OnInit {
  @ViewChild(CalendarComponent, null) myCalendar: CalendarComponent;
  userRole = 'user';

  selectedCompany = 'all';
  selectedTime: Date;
  currentDate: Date;
  eventSource = [];
  unFilteredEvents = [];
  calendar = {
    mode: 'month',
    today: new Date()
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentsService: AppointmentsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(_ => {
      this.unFilteredEvents = [];
      this.eventSource = this.unFilteredEvents;
      this.initializeCalendar();
    });
    this.loadUserRole();
  }

  loadUserRole(): void {
    this.userService.getApplicationUser().subscribe(
      response => this.userRole = response.userRole
    );
  }

  initializeCalendar(): void {
    this.calendar.today.setHours(0, 0, 0, 0);
    this.currentDate = this.calendar.today;
    this.loadEvents();
  }

  loadEvents(): void {
    this.appointmentsService.getAppointments().subscribe(
      response => this.loadEventSource(response.appointments)
    );
  }

  loadEventSource(appointments): void {
    appointments.forEach(appointment => {
      this.unFilteredEvents.push({
        startTime: new Date(appointment.startDate),
        endTime: new Date(appointment.endDate),
        startDate: appointment.startDate,
        endDate: appointment.endDate,
        companyId: appointment.companyId,
        companyName: appointment.companyName,
        companyType: appointment.companyType,
        userName: appointment.userName,
        userPhone: appointment.userPhone,
        requestedAt: appointment.requestedAt
      });
    });
    if (this.selectedCompany !== 'all') {
      this.eventSource = this.unFilteredEvents.filter(x => x.companyId === this.selectedCompany);
    } else {
      this.eventSource = this.unFilteredEvents;
    }
    this.myCalendar.loadEvents();
  }

  onTimeSelected(event: { selectedTime: Date, events: any[] }) {
    if (event.selectedTime >= this.calendar.today) {
      this.selectedTime = event.selectedTime;
    }
  }

  onCurrentDateChanged(event: Date): void {
    this.currentDate = event;
  }

  navigate(event: {id: string, date: any}): void {
    if (this.userRole === 'user') {
      this.router.navigateByUrl('/company/' + event.id);
    } else {
      this.router.navigate(['/company_management/' + event.id], { queryParams: { date: event.date }});
    }
  }

  filterCompanies(companySelected: string): void {
    this.selectedCompany = companySelected;
    if (this.selectedCompany !== 'all') {
      this.eventSource = this.unFilteredEvents.filter(x => x.companyId === this.selectedCompany);
    } else {
      this.eventSource = this.unFilteredEvents;
    }
    this.myCalendar.loadEvents();
  }

  getMonthName(): string {
    return 'MONTHS.' + monthNames[this.currentDate.getMonth()].toUpperCase();
  }

  markDisabled = (date: Date) => {
    return date < this.calendar.today;
  }

  manager(): boolean {
    return this.userRole === 'manager';
  }
}
