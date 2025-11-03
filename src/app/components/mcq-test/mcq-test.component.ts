import { Component } from '@angular/core';

@Component({
  selector: 'app-mcq-test',
  templateUrl: './mcq-test.component.html',
  styleUrls: ['./mcq-test.component.css']
})
export class McqTestComponent {
  questions = [
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5"],
      answer: "4"
    },
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Rome"],
      answer: "Paris"
    }
  ];

  selectedAnswers = [];

  onAnswerChange(question, answer) {
    const selectedIndex = this.selectedAnswers.findIndex(item => item.question === question);
    if (selectedIndex === -1) {
      this.selectedAnswers.push({ question, answer });
    } else {
      this.selectedAnswers[selectedIndex].answer = answer;
    }
  }

  onSubmit() {
    let score = 0;
    this.selectedAnswers.forEach(item => {
      const correctAnswer = this.questions.find(q => q.question === item.question).answer;
      if (item.answer === correctAnswer) {
        score++;
      }
    });
    alert(`You scored ${score} out of ${this.questions.length}`);
  }
}