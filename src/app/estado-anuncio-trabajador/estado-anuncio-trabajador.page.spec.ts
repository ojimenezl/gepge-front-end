import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstadoAnuncioTrabajadorPage } from './estado-anuncio-trabajador.page';

describe('EstadoAnuncioTrabajadorPage', () => {
  let component: EstadoAnuncioTrabajadorPage;
  let fixture: ComponentFixture<EstadoAnuncioTrabajadorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoAnuncioTrabajadorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstadoAnuncioTrabajadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
