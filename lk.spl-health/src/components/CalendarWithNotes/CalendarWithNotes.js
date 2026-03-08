import React from "react";
import { useAuth } from '../../hooks/useAuth';
import moment from "moment";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './CalendarWithNotes.css';
import { CalendarAPI } from "../../app/API/api";

// React компонент календаря
const CalendarWithNotes = ({lesson, mode}) => {

    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [notes, setNotes] = React.useState([]);
    const [currentDateNotes, setCurrentDateNotes] = React.useState([]);
    const [newNote, setNewNote] = React.useState('');
    const [noteColor, setNoteColor] = React.useState('#ffffff');
    const [loading, setLoading] = React.useState(false);
    const [editingNoteId, setEditingNoteId] = React.useState(null);
    const [editContent, setEditContent] = React.useState('');
    const { isOrdinaryUser } = useAuth();
    
    // Цветовая палитра
    const colors = [
        '#ffffff', '#ffebee', '#f3e5f5', '#e8eaf6',
        '#e3f2fd', '#e0f2f1', '#f1f8e9', '#fffde7',
        '#fff3e0', '#fbe9e7'
    ];
    
    // Инициализация moment на русском
    moment.locale('ru');
    
    // Загрузка всех заметок
    const loadNotes = async () => {
        setLoading(true);
        try {
            //const response = await instance.get(getApiEndpoint());
            const response = await CalendarAPI.loadNotes();

            if (response.data.success) {
                if (mode == 'admin') {
                    const res1 = response.data.data.filter(elem => elem.program_id == lesson.programs_id);
                    const res2 = res1.filter(elem => elem.lesson_id == lesson.id);
                    setNotes(res2);
                } else {
                    const res = response.data.data;
                    const resArray = [];

                    lesson.forEach(element => {
                        const res1 = res.filter(elem => elem.lesson_id == element.id);

                        resArray.push(...res1);
                    });

                    setNotes(resArray);
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки заметок:', error);
            alert('Не удалось загрузить заметки');
        } finally {
            setLoading(false);
        }
    };
    
    // Загрузка заметок при монтировании
    React.useEffect(() => {
        loadNotes();
    }, []);
    
    // Обновление заметок для выбранной даты
    React.useEffect(() => {
        const dateStr = moment(selectedDate).format('YYYY-MM-DD');
        const filteredNotes = notes.filter(note => 
            moment(note.date).format('YYYY-MM-DD') === dateStr
        );
        setCurrentDateNotes(filteredNotes);
    }, [selectedDate, notes]);
    
    // Создание новой заметки
    const createNote = async () => {
        if (!newNote.trim()) {
            alert('Введите текст заметки');
            return;
        }
        
        try {
            const noteData = {
                program_id: lesson.programs_id,
                lesson_id: lesson.id,
                date: moment(selectedDate).format('YYYY-MM-DD'),
                content: `Занятие "${lesson.name}" ` + newNote,
                color: noteColor
            };
            
            //const response = await instance.post(getApiEndpoint(), noteData);
            const response = await CalendarAPI.createNote(noteData);
            
            if (response.data.success) {
                setNotes([...notes, response.data.data]);
                setNewNote('');
                alert('Заметка добавлена!');
            }
        } catch (error) {
            console.error('Ошибка создания заметки:', error);
            alert('Не удалось создать заметку');
        }
    };
    
    // Обновление заметки
    const updateNote = async (id) => {
        if (!editContent.trim()) {
            alert('Введите текст заметки');
            return;
        }
        
        try {
            //const response = await instance.put(`${getApiEndpoint()}/${id}`, {
                //content: editContent
            //});
            const response = await CalendarAPI.updateNote(id, editContent);
            
            if (response.data.success) {
                setNotes(notes.map(note => 
                    note.id === id ? response.data.data : note
                ));
                setEditingNoteId(null);
                setEditContent('');
                alert('Заметка обновлена!');
            }
        } catch (error) {
            console.error('Ошибка обновления заметки:', error);
            alert('Не удалось обновить заметку');
        }
    };
    
    // Удаление заметки
    const deleteNote = async (id) => {
        //if (!confirm('Вы уверены, что хотите удалить эту заметку?')) {
            //return;
        //}
        
        try {
            //const response = await instance.delete(`${getApiEndpoint()}/${id}`);
            const response = await CalendarAPI.deleteNote(id);

            if (response.data.success) {
                setNotes(notes.filter(note => note.id !== id));
                alert('Заметка удалена!');
            }
        } catch (error) {
            console.error('Ошибка удаления заметки:', error);
            alert('Не удалось удалить заметку');
        }
    };
    
    // Контент для ячеек календаря
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = moment(date).format('YYYY-MM-DD');
            const dayNotes = notes.filter(note => 
                moment(note.date).format('YYYY-MM-DD') === dateStr
            );
            
            if (dayNotes.length > 0) {
                return React.createElement('div', {
                    className: 'notes-indicator'
                },
                    dayNotes.map((note, index) => 
                        React.createElement('div', {
                            key: index,
                            className: 'note-dot',
                            style: { backgroundColor: "#000" },
                            title: note.content.length > 50 ? 
                                note.content.substring(0, 50) + '...' : note.content
                        })
                    )
                );
            }
        }
        return null;
    };

    const tileClassName = ({ date, view }) => {
        return 'today-cell'; // Все ячейки должны стать красными
    };
    
    // Рендер компонента
    return React.createElement('div', { className: 'calendar-widget-container' },
        // Заголовок
        React.createElement('div', { className: 'widget-header' },
            React.createElement('h2', null, '📅 Календарь с заметками'),
            React.createElement('button', {
                className: 'btn-refresh',
                onClick: loadNotes,
                disabled: loading
            }, loading ? 'Загрузка...' : '🔄 Обновить')
        ),
        
        // Основной контейнер
        React.createElement('div', { className: 'calendar-main' },
            // Календарь
            React.createElement('div', { className: 'calendar-wrapper' },
                React.createElement(Calendar, {
                    onChange: setSelectedDate,
                    value: selectedDate,
                    tileContent: tileContent,
                    tileClassName: tileClassName,
                    className: 'react-calendar-custom',
                    locale: 'ru-RU',
                })
            ),
            
            // Блок заметок
            React.createElement('div', { className: 'notes-sidebar' },
                // Заголовок с датой
                React.createElement('div', { className: 'notes-header' },
                    React.createElement('h3', null,
                        '📝 Заметки на ',
                        React.createElement('span', { className: 'current-date' },
                            moment(selectedDate).format('DD MMMM YYYY')
                        ),
                        React.createElement('span', { className: 'notes-count' },
                            ` (${currentDateNotes.length})`
                        )
                    )
                ),
                
                // Список заметок
                React.createElement('div', { className: 'notes-list' },
                    currentDateNotes.length > 0 ? 
                        currentDateNotes.map(note => 
                            React.createElement('div', {
                                key: note.id,
                                className: 'note-item',
                                style: { backgroundColor: note.color }
                            },
                                editingNoteId === note.id ?
                                    // Редактирование заметки
                                    React.createElement('div', { className: 'note-edit' },
                                        React.createElement('textarea', {
                                            value: editContent,
                                            onChange: (e) => setEditContent(e.target.value),
                                            placeholder: 'Текст заметки...',
                                            rows: 3
                                        }),
                                        React.createElement('div', { className: 'edit-actions' },
                                            React.createElement('button', {
                                                className: 'btn-save',
                                                onClick: () => updateNote(note.id)
                                            }, '💾 Сохранить'),
                                            React.createElement('button', {
                                                className: 'btn-cancel',
                                                onClick: () => {
                                                    setEditingNoteId(null);
                                                    setEditContent('');
                                                }
                                            }, '❌ Отмена')
                                        )
                                    )
                                :
                                    // Отображение заметки
                                    React.createElement(React.Fragment, null,
                                        React.createElement('div', { className: 'note-content' },
                                            React.createElement('div', { className: 'note-text' }, note.content),
                                            React.createElement('div', { className: 'note-meta' },
                                                moment(note.created_at).format('HH:mm')
                                            )
                                        ),
                                        !isOrdinaryUser ? (
                                        React.createElement('div', { className: 'note-actions' },
                                            React.createElement('button', {
                                                className: 'btn-edit',
                                                onClick: () => {
                                                    setEditingNoteId(note.id);
                                                    setEditContent(note.content);
                                                },
                                                title: 'Редактировать'
                                            }, '✏️'),
                                            React.createElement('button', {
                                                className: 'btn-delete',
                                                onClick: () => deleteNote(note.id),
                                                title: 'Удалить'
                                            }, '🗑️')
                                        )) : (
                                          React.createElement('div')
                                        )
                                    )
                            )
                        )
                    :
                        React.createElement('div', { className: 'no-notes' },
                            React.createElement('p', null, '📭 Нет заметок на эту дату'),
                            React.createElement('p', { className: 'hint' }, 'Добавьте первую заметку ниже')
                        )
                ),
                !isOrdinaryUser ?  (
                // Форма добавления заметки
                React.createElement('div', { className: 'add-note-form' },
                    React.createElement('h4', null, '➕ Новая заметка'),
                    React.createElement('textarea', {
                        value: newNote,
                        onChange: (e) => setNewNote(e.target.value),
                        placeholder: 'Введите текст заметки...',
                        rows: 4
                    }),
                    
                    // Выбор цвета
                    React.createElement('div', { className: 'color-selector' },
                        React.createElement('span', { className: 'color-label' }, 'Цвет:'),
                        colors.map(color =>
                            React.createElement('button', {
                                key: color,
                                className: `color-option ${noteColor === color ? 'active' : ''}`,
                                style: { backgroundColor: color },
                                onClick: () => setNoteColor(color),
                                title: color
                            })
                        )
                    ),
                    
                    // Кнопка добавления
                    React.createElement('button', {
                        className: 'btn-add-note',
                        onClick: createNote,
                        disabled: !newNote.trim()
                    }, '✅ Добавить заметку')
                )) : (
                  React.createElement('div')
                )
            )
        )
    );
};

export default CalendarWithNotes;