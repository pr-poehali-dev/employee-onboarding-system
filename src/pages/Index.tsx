import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

type UserRole = 'technician' | 'hr_specialist' | 'new_employee';

interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  position: string;
}

interface Approver {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
}

interface ApprovalRequest {
  id: string;
  employeeName: string;
  department: string;
  subdivision: string;
  position: string;
  ipAddress: string;
  orderDocument: string;
  status: 'pending' | 'approved' | 'rejected' | 'installing' | 'completed';
  approvers: Approver[];
  createdAt: string;
  approvedAt?: string;
}

interface Software {
  id: string;
  name: string;
  category: string;
  version: string;
  department: string;
  position: string;
  status: 'approved' | 'pending' | 'restricted';
  licenseDocument: string;
  approvalOrder: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  status: 'success' | 'warning' | 'error';
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSubdivision, setSelectedSubdivision] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [newEmployeeIP, setNewEmployeeIP] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentRequest, setCurrentRequest] = useState<ApprovalRequest | null>(null);

  // Mock data
  const users: User[] = [
    { id: '1', name: 'Техник Иванов', role: 'technician', department: 'IT', position: 'Системный администратор' },
    { id: '2', name: 'HR Петрова', role: 'hr_specialist', department: 'Кадры', position: 'Специалист по персоналу' },
    { id: '3', name: 'Новичок Сидоров', role: 'new_employee', department: 'Финансы', position: 'Экономист' }
  ];

  const departments = [
    { id: 'finance', name: 'Финансовая дирекция', subdivisions: ['Бухгалтерия', 'Планово-экономический отдел'] },
    { id: 'it', name: 'Служба информационных технологий', subdivisions: ['Отдел разработки', 'Системное администрирование'] },
    { id: 'hr', name: 'Дирекция по персоналу', subdivisions: ['Отдел кадров', 'Отдел обучения'] }
  ];

  const positions = [
    'Системный администратор', 'Программист', 'Экономист', 'Бухгалтер', 
    'Специалист по персоналу', 'Менеджер проектов'
  ];

  const software: Software[] = [
    {
      id: '1',
      name: 'Microsoft Office 365',
      category: 'Офисные приложения',
      version: '2024',
      department: 'Все дирекции',
      position: 'Все должности',
      status: 'approved',
      licenseDocument: 'Лицензия MS365-2024.pdf',
      approvalOrder: 'Приказ №45 от 15.01.2024'
    },
    {
      id: '2',
      name: '1C: Бухгалтерия',
      category: 'Учетные системы',
      version: '8.3',
      department: 'Финансовая дирекция',
      position: 'Бухгалтер, Экономист',
      status: 'approved',
      licenseDocument: 'Лицензия 1С-БУХ.pdf',
      approvalOrder: 'Приказ №12 от 03.02.2024'
    },
    {
      id: '3',
      name: 'AutoCAD',
      category: 'САПР',
      version: '2024',
      department: 'Техническая дирекция',
      position: 'Инженер-конструктор',
      status: 'pending',
      licenseDocument: 'В обработке',
      approvalOrder: 'В обработке'
    }
  ];

  const activityLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: '2024-08-09 14:30:25',
      user: 'Техник Иванов',
      action: 'Установка ПО',
      target: 'Microsoft Office 365 → Рабочее место №15',
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2024-08-09 13:15:42',
      user: 'HR Петрова',
      action: 'Загрузка документа',
      target: 'Приказ о принятии на работу',
      status: 'success'
    },
    {
      id: '3',
      timestamp: '2024-08-09 12:45:18',
      user: 'Новичок Сидоров',
      action: 'Запрос доступа',
      target: '1C: Бухгалтерия',
      status: 'warning'
    }
  ];

  const handleLogin = (role: UserRole) => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleSubmitForApproval = () => {
    if (!selectedDepartment || !selectedPosition || !newEmployeeIP || !employeeName) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const requestApprovers = approversArchive[selectedPosition] || [];
    
    const newRequest: ApprovalRequest = {
      id: Date.now().toString(),
      employeeName,
      department: departments.find(d => d.id === selectedDepartment)?.name || '',
      subdivision: selectedSubdivision,
      position: selectedPosition,
      ipAddress: newEmployeeIP,
      orderDocument: uploadedFile?.name || 'Приказ загружен',
      status: 'pending',
      approvers: requestApprovers,
      createdAt: new Date().toISOString()
    };

    setCurrentRequest(newRequest);
    alert(`Заявка отправлена на согласование.\nСогласующие: ${requestApprovers.map(a => a.name).join(', ')}`);
  };

  const handleApprove = () => {
    if (currentRequest) {
      setCurrentRequest({
        ...currentRequest,
        status: 'approved',
        approvedAt: new Date().toISOString()
      });
    }
  };

  const handleInstallSoftware = () => {
    if (currentRequest) {
      setCurrentRequest({
        ...currentRequest,
        status: 'installing'
      });
      
      setTimeout(() => {
        setCurrentRequest(prev => prev ? {
          ...prev,
          status: 'completed'
        } : null);
        alert('Программное обеспечение успешно установлено на рабочее место!');
      }, 3000);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail('');
    setSelectedDepartment('');
    setSelectedPosition('');
    setNewEmployeeIP('');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Icon name="Shield" size={32} className="text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Система управления ПО</CardTitle>
            <p className="text-muted-foreground">Войдите для доступа к системе</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Email или логин"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Пароль"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Демо-доступ:</p>
              <div className="grid gap-2">
                <Button 
                  onClick={() => handleLogin('technician')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Icon name="Settings" size={16} className="mr-2" />
                  Войти как Техник
                </Button>
                <Button 
                  onClick={() => handleLogin('hr_specialist')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Icon name="Users" size={16} className="mr-2" />
                  Войти как HR-специалист
                </Button>
                <Button 
                  onClick={() => handleLogin('new_employee')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Войти как Новый сотрудник
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // New employee and HR specialist see the form interface
  if (currentUser.role === 'new_employee' || currentUser.role === 'hr_specialist') {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Icon name="Shield" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Система управления ПО</h1>
                <p className="text-sm text-muted-foreground">
                  Пользователь: {currentUser.name} • {currentUser.role === 'hr_specialist' ? 'HR-специалист' : 'Новый сотрудник'}
                </p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Icon name="UserPlus" size={24} className="mr-3" />
                {currentUser.role === 'hr_specialist' ? 'Регистрация нового сотрудника' : 'Заявка на доступ к ПО'}
              </CardTitle>
              <p className="text-muted-foreground">
                {currentUser.role === 'hr_specialist' 
                  ? 'Заполните данные для регистрации нового сотрудника в системе'
                  : 'Укажите ваши данные для получения доступа к необходимому программному обеспечению'
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      ФИО сотрудника <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input 
                        placeholder="Иванов Иван Иванович"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        className="pl-10"
                      />
                      <Icon name="User" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Дирекция/Служба <span className="text-red-500">*</span>
                    </label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите дирекцию или службу" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>
                            <div className="flex items-center">
                              <Icon name="Building" size={16} className="mr-2" />
                              {dept.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Отдел/Сектор <span className="text-red-500">*</span>
                    </label>
                    <Select value={selectedSubdivision} onValueChange={setSelectedSubdivision} disabled={!selectedDepartment}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Сначала выберите дирекцию" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedDepartment && departments.find(d => d.id === selectedDepartment)?.subdivisions.map(sub => (
                          <SelectItem key={sub} value={sub}>
                            <div className="flex items-center">
                              <Icon name="Users" size={16} className="mr-2" />
                              {sub}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Должность <span className="text-red-500">*</span>
                    </label>
                    <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите должность" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map(pos => (
                          <SelectItem key={pos} value={pos}>
                            <div className="flex items-center">
                              <Icon name="Briefcase" size={16} className="mr-2" />
                              {pos}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      IP адрес компьютера <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input 
                        placeholder="Например: 192.168.1.100"
                        value={newEmployeeIP}
                        onChange={(e) => setNewEmployeeIP(e.target.value)}
                        className="pl-10"
                      />
                      <Icon name="Monitor" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Укажите IP адрес рабочего места, на котором будет установлено ПО
                    </p>
                  </div>
                </div>

                {/* Right Column - File Upload */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Приказ о принятии на работу <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Icon name="Upload" size={24} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Перетащите файл сюда</p>
                          <p className="text-xs text-muted-foreground">или нажмите для выбора</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Icon name="FolderOpen" size={16} className="mr-2" />
                          Выбрать файл
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Поддерживаемые форматы: PDF, DOC, DOCX (макс. 10 МБ)
                    </p>
                  </div>

                  {/* Progress/Status Section */}
                  <div className="bg-slate-100 rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-3 flex items-center">
                      <Icon name="CheckCircle" size={16} className="mr-2 text-green-600" />
                      Статус заявки
                    </h4>
                    {currentRequest ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>{currentRequest.employeeName}</span>
                          <Badge variant={
                            currentRequest.status === 'pending' ? 'secondary' :
                            currentRequest.status === 'approved' ? 'default' :
                            currentRequest.status === 'installing' ? 'outline' :
                            currentRequest.status === 'completed' ? 'default' : 'destructive'
                          }>
                            {currentRequest.status === 'pending' ? 'На согласовании' :
                             currentRequest.status === 'approved' ? 'Согласовано' :
                             currentRequest.status === 'installing' ? 'Установка ПО' :
                             currentRequest.status === 'completed' ? 'Завершено' : 'Отклонено'}
                          </Badge>
                        </div>
                        <Progress value={
                          currentRequest.status === 'pending' ? 25 :
                          currentRequest.status === 'approved' ? 50 :
                          currentRequest.status === 'installing' ? 75 :
                          currentRequest.status === 'completed' ? 100 : 0
                        } className="h-2" />
                        {currentRequest.approvers.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Согласующие:</p>
                            {currentRequest.approvers.map((approver, index) => (
                              <div key={approver.id} className="flex items-center text-xs">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className="flex-1">{approver.name}</span>
                                <span className="text-muted-foreground">{approver.position}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Заполнение данных</span>
                          <Badge variant="secondary">В процессе</Badge>
                        </div>
                        <Progress value={60} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Заполните все обязательные поля для отправки заявки
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={handleLogout}>
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Назад
                </Button>
                <div className="flex gap-3">
                  {currentRequest && currentRequest.status === 'approved' && (
                    <Button 
                      onClick={handleInstallSoftware}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={currentRequest.status === 'installing'}
                    >
                      <Icon name="Download" size={16} className="mr-2" />
                      {currentRequest.status === 'installing' ? 'Установка...' : 'Установить программы'}
                    </Button>
                  )}
                  <Button 
                    onClick={handleSubmitForApproval}
                    className="px-8"
                    disabled={!selectedDepartment || !selectedPosition || !newEmployeeIP || !employeeName || currentRequest?.status === 'pending'}
                  >
                    <Icon name="Send" size={16} className="mr-2" />
                    {currentRequest ? 
                      (currentRequest.status === 'pending' ? 'Заявка отправлена' : 
                       currentRequest.status === 'approved' ? 'Согласовано' :
                       currentRequest.status === 'installing' ? 'Установка ПО...' :
                       currentRequest.status === 'completed' ? 'Завершено' : 'Отклонено') :
                      (currentUser.role === 'hr_specialist' ? 'Отправить на согласование' : 'Отправить заявку')
                    }
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Icon name="Shield" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Система управления ПО</h1>
              <p className="text-sm text-muted-foreground">
                Пользователь: {currentUser.name} • Техник
              </p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего программ</CardTitle>
              <Icon name="Package" size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{software.length}</div>
              <p className="text-xs text-muted-foreground">+2 за последний месяц</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активные лицензии</CardTitle>
              <Icon name="FileCheck" size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{software.filter(s => s.status === 'approved').length}</div>
              <p className="text-xs text-muted-foreground">Действующих разрешений</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Установок сегодня</CardTitle>
              <Icon name="Download" size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 с вчера</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Загруженность</CardTitle>
              <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="software" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="software">Каталог ПО</TabsTrigger>
            <TabsTrigger value="requests">
              {currentUser.role === 'new_employee' ? 'Мой запрос' : 'Запросы'}
            </TabsTrigger>
            <TabsTrigger value="approvers">Согласующие</TabsTrigger>
            <TabsTrigger value="logs">Журнал действий</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

          <TabsContent value="software" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Package" size={20} className="mr-2" />
                  Каталог программного обеспечения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название ПО</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Дирекция/Отдел</TableHead>
                      <TableHead>Должности</TableHead>
                      <TableHead>Статус</TableHead>
                      {currentUser.role === 'technician' && <TableHead>Действия</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {software.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">v{item.version}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              item.status === 'approved' ? 'default' : 
                              item.status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {item.status === 'approved' ? 'Одобрено' : 
                             item.status === 'pending' ? 'В ожидании' : 'Ограничено'}
                          </Badge>
                        </TableCell>
                        {currentUser.role === 'technician' && (
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Icon name="Download" size={14} className="mr-1" />
                              Установить
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="FileText" size={20} className="mr-2" />
                  {currentUser.role === 'new_employee' ? 'Запрос доступа к ПО' : 'Управление запросами'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentUser.role === 'new_employee' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Дирекция/Служба</label>
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите дирекцию" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Отдел/Сектор</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите отдел" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedDepartment && departments.find(d => d.id === selectedDepartment)?.subdivisions.map(sub => (
                              <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Должность</label>
                        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите должность" />
                          </SelectTrigger>
                          <SelectContent>
                            {positions.map(pos => (
                              <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">IP адрес рабочего места</label>
                        <Input 
                          placeholder="192.168.1.100"
                          value={newEmployeeIP}
                          onChange={(e) => setNewEmployeeIP(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Приказ о принятии на работу</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                          <Icon name="Upload" size={24} className="mx-auto text-slate-400 mb-2" />
                          <p className="text-sm text-slate-500">Перетащите файл или нажмите для выбора</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Выбрать файл
                          </Button>
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        <Icon name="Send" size={16} className="mr-2" />
                        Отправить запрос
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="Inbox" size={48} className="mx-auto text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Нет активных запросов</h3>
                    <p className="text-muted-foreground">Новые запросы от сотрудников появятся здесь</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Users" size={20} className="mr-2" />
                  Архив согласующих по должностям
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Управление списком согласующих лиц для каждой должности
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(approversArchive).map(([position, approvers]) => (
                    <Card key={position} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Icon name="Briefcase" size={18} className="mr-2" />
                            {position}
                          </div>
                          <Badge variant="outline">
                            {approvers.length} согласующих
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {approvers.map((approver) => (
                            <Card key={approver.id} className="border border-slate-200">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                        <Icon name="User" size={16} className="text-primary" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-sm">{approver.name}</h4>
                                        <p className="text-xs text-muted-foreground">{approver.position}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                      <div className="flex items-center text-muted-foreground">
                                        <Icon name="Building" size={12} className="mr-1" />
                                        {approver.department}
                                      </div>
                                      <div className="flex items-center text-muted-foreground">
                                        <Icon name="Mail" size={12} className="mr-1" />
                                        {approver.email}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                      <Icon name="Edit2" size={12} />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-600">
                                      <Icon name="Trash2" size={12} />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          <Card className="border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
                            <CardContent className="p-4 flex items-center justify-center">
                              <Button variant="ghost" className="h-full w-full flex-col space-y-2 text-slate-500 hover:text-slate-700">
                                <Icon name="Plus" size={20} />
                                <span className="text-xs">Добавить согласующего</span>
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card className="border-2 border-dashed border-slate-300">
                    <CardContent className="p-6 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                          <Icon name="Plus" size={24} className="text-slate-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Добавить новую должность</h3>
                          <p className="text-sm text-muted-foreground">Создайте архив согласующих для новой должности</p>
                        </div>
                        <Button variant="outline">
                          <Icon name="Plus" size={16} className="mr-2" />
                          Добавить должность
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Activity" size={20} className="mr-2" />
                  Журнал действий пользователей
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Время</TableHead>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Действие</TableHead>
                      <TableHead>Объект</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.target}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              log.status === 'success' ? 'default' : 
                              log.status === 'warning' ? 'secondary' : 'destructive'
                            }
                          >
                            <Icon 
                              name={
                                log.status === 'success' ? 'CheckCircle' : 
                                log.status === 'warning' ? 'AlertTriangle' : 'XCircle'
                              } 
                              size={12} 
                              className="mr-1" 
                            />
                            {log.status === 'success' ? 'Успешно' : 
                             log.status === 'warning' ? 'Предупреждение' : 'Ошибка'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="PieChart" size={20} className="mr-2" />
                    Распределение по дирекциям
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Финансовая дирекция</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={40} className="w-20" />
                        <span className="text-sm">40%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>IT-служба</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={35} className="w-20" />
                        <span className="text-sm">35%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Дирекция по персоналу</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={25} className="w-20" />
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="BarChart3" size={20} className="mr-2" />
                    Активность по месяцам
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Июль 2024</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20" />
                        <span className="text-sm">85</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Июнь 2024</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={72} className="w-20" />
                        <span className="text-sm">72</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Май 2024</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={68} className="w-20" />
                        <span className="text-sm">68</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;