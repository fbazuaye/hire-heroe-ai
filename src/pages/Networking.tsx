import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Edit, Trash2, Linkedin, Mail, Phone } from 'lucide-react';
import { useContacts, type Contact } from '@/hooks/useContacts';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Networking = () => {
  const { contacts, loading, addContact, updateContact, deleteContact } = useContacts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    linkedin_url: '',
    notes: '',
    connection_strength: 'weak' as 'weak' | 'medium' | 'strong',
    last_contact_date: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      linkedin_url: '',
      notes: '',
      connection_strength: 'weak',
      last_contact_date: ''
    });
    setEditingContact(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContact) {
      await updateContact(editingContact.id, formData);
    } else {
      await addContact(formData);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      linkedin_url: contact.linkedin_url || '',
      notes: contact.notes || '',
      connection_strength: contact.connection_strength,
      last_contact_date: contact.last_contact_date || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(id);
    }
  };

  const getConnectionStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="p-6">Loading contacts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Networking</h1>
          <p className="text-muted-foreground">Manage your professional contacts and relationships</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
                <DialogDescription>
                  {editingContact ? 'Update contact information.' : 'Add a new professional contact to your network.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="connection_strength" className="text-right">Connection</Label>
                  <Select value={formData.connection_strength} onValueChange={(value: 'weak' | 'medium' | 'strong') => setFormData({...formData, connection_strength: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">Weak</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="strong">Strong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingContact ? 'Update' : 'Add'} Contact</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building your professional network by adding your first contact.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    {contact.position && contact.company && (
                      <CardDescription>{contact.position} at {contact.company}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-3 h-3 rounded-full ${getConnectionStrengthColor(contact.connection_strength)}`} title={`${contact.connection_strength} connection`} />
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(contact)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(contact.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contact.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${contact.email}`} className="hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`tel:${contact.phone}`} className="hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.linkedin_url && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Linkedin className="h-4 w-4 mr-2" />
                      <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {contact.notes && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {contact.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Networking;