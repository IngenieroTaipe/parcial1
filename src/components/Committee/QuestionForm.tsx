import { useState } from 'react';
import { Question } from '../../types';

interface QuestionFormProps {
  onAdd: (question: Question) => void;
  onCancel: () => void;
}

export default function QuestionForm({ onAdd, onCancel }: QuestionFormProps) {
  const [text, setText] = useState('');
  const [type, setType] = useState<'multiple' | 'open'>('multiple');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [error, setError] = useState('');

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);

    if (correctAnswer === options[index]) setCorrectAnswer('');
  };

  const handleSubmit = () => {
    setError('');

    if (!text.trim()) {
      setError('El enunciado de la pregunta es obligatorio.');
      return;
    }

    if (type === 'multiple') {
      if (options.some((o) => !o.trim())) {
        setError('Debes completar las 4 opciones.');
        return;
      }
      if (!correctAnswer) {
        setError('Debes seleccionar la respuesta correcta.');
        return;
      }
    }

    if (type === 'open' && !correctAnswer.trim()) {
      setError('Debes indicar la respuesta esperada.');
      return;
    }

    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: text.trim(),
      type,
      options: type === 'multiple' ? options.map((o) => o.trim()) : [],
      correctAnswer: correctAnswer.trim(),
    };

    onAdd(newQuestion);
  };

  return (
    <div className="question-form-card">
      <h3 className="question-form-title">Nueva Pregunta</h3>

      <div className="form-group">
        <label className="form-label">Enunciado</label>
        <textarea
          className="form-textarea"
          placeholder="Escribe la pregunta aquí..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Tipo de pregunta</label>
        <select
          className="form-select"
          value={type}
          onChange={(e) => {
            setType(e.target.value as 'multiple' | 'open');
            setCorrectAnswer('');
          }}
        >
          <option value="multiple">Opción múltiple</option>
          <option value="open">Respuesta abierta</option>
        </select>
      </div>

      {type === 'multiple' && (
        <>
          <div className="form-group">
            <label className="form-label">Opciones</label>
            {options.map((opt, i) => (
              <input
                key={i}
                className="form-input option-input"
                type="text"
                placeholder={`Opción ${i + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
              />
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Respuesta correcta</label>
            <select
              className="form-select"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            >
              <option value="">-- Selecciona la respuesta correcta --</option>
              {options.map((opt, i) =>
                opt.trim() ? (
                  <option key={i} value={opt}>
                    Opción {i + 1}: {opt}
                  </option>
                ) : null
              )}
            </select>
          </div>
        </>
      )}

      {type === 'open' && (
        <div className="form-group">
          <label className="form-label">Respuesta esperada</label>
          <input
            className="form-input"
            type="text"
            placeholder="Escribe la respuesta esperada..."
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          />
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Confirmar pregunta
        </button>
      </div>
    </div>
  );
}
