import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
})
export class PaymentMethodPage implements OnInit {

  creditCardForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.creditCardForm = this.formBuilder.group({
      cardNumber: ['', Validators.required],
      cardHolderName: ['', Validators.required],
      expirationDate: ['', Validators.required],
      securityCode: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log("afuer");
    console.log(this.creditCardForm.value);
    if (!this.creditCardForm.valid) {
      console.log("aqui");
      return;
    }
    
    const cardNumber = this.creditCardForm.value.cardNumber;
    console.log(cardNumber);
    
    if (!this.isValidCardNumber(cardNumber)) {
      console.log("error");
      
      // Mostrar un mensaje de error indicando que la tarjeta no es válida
      return;
    }
    
    // El número de tarjeta es válido, continuar con el proceso de pago
    // ...
    // Aquí podrías enviar los datos de la tarjeta de crédito al servidor para procesar el pago
  }
  isValidCardNumber(cardNumber: string): boolean {
    // Invertir el número de la tarjeta y separar cada dígito en un array
    const digits = cardNumber.split('').reverse().map(Number);
    
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let digit = digits[i];
      
      // Duplicar cada segundo dígito, empezando por el penúltimo
      if (i % 2 === 1) {
        digit *= 2;
        
        // Sumar los dígitos individuales de cada número duplicado
        if (digit > 9) {
          digit = digit.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        }
      }
      
      sum += digit;
    }
    
    // Verificar si el resultado de la suma es divisible por 10
    return sum % 10 === 0;
  }


}
