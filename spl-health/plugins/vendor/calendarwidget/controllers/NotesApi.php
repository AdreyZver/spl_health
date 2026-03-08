<?php namespace Vendor\CalendarWidget\Controllers;

use Input;
use Response;
use Validator;
use Vendor\CalendarWidget\Models\Note;

class NotesApi
{
    public function index()
    {
        try {
            $notes = Note::orderBy('date', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $notes,
                'count' => $notes->count()
            ]);
            
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function getByDate($date)
    {
        try {
            // Валидация даты
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
                return $this->errorResponse('Неверный формат даты', 400);
            }

            $notes = Note::where('date', $date)->get();
            
            return response()->json([
                'success' => true,
                'date' => $date,
                'data' => $notes,
                'count' => $notes->count()
            ]);
            
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function store()
    {
        try {
            $data = Input::all();
            
            $validator = Validator::make($data, [
                'program_id' => 'nullable|integer',
                'lesson_id' => 'nullable|integer',
                'date' => 'required|date',
                'content' => 'required|string|max:2000',
                'color' => 'nullable|string|max:7'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $note = Note::create([
                'program_id' => $data['program_id'],
                'lesson_id' => $data['lesson_id'],
                'date' => $data['date'],
                'content' => $data['content'],
                'color' => $data['color'] ?? '#ffffff'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Заметка создана',
                'data' => $note
            ], 201);
            
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function update($id)
    {
        try {
            $note = Note::find($id);
            
            if (!$note) {
                return $this->errorResponse('Заметка не найдена', 404);
            }

            $data = Input::all();
            
            $validator = Validator::make($data, [
                'content' => 'sometimes|required|string|max:2000',
                'color' => 'sometimes|nullable|string|max:7'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $note->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Заметка обновлена',
                'data' => $note
            ]);
            
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $note = Note::find($id);
            
            if (!$note) {
                return $this->errorResponse('Заметка не найдена', 404);
            }

            $note->delete();

            return response()->json([
                'success' => true,
                'message' => 'Заметка удалена'
            ]);
            
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    private function errorResponse($message, $code = 500)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'code' => $code
        ], $code);
    }
}