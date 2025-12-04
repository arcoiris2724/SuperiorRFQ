import { useState, useRef } from 'react';
import { Camera, Upload, X, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';

interface Props {
  onComplete: (photoUrl: string, notes: string) => void;
  onCancel: () => void;
  deliveryRef: string;
}

export default function PhotoCapture({ onComplete, onCancel, deliveryRef }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    let photoUrl = '';

    if (photo) {
      try {
        const base64Data = photo.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        const fileName = `proof-${deliveryRef}-${Date.now()}.jpg`;
        const { data } = await supabase.storage.from('quote-photos').upload(fileName, blob);
        
        if (data) {
          const { data: urlData } = supabase.storage.from('quote-photos').getPublicUrl(fileName);
          photoUrl = urlData.publicUrl;
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    }

    setUploading(false);
    onComplete(photoUrl, notes);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      <div className="bg-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Proof of Delivery</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-auto">
        {photo ? (
          <div className="relative flex-1 flex flex-col">
            <img src={photo} alt="Proof" className="w-full rounded-xl object-contain max-h-[50vh]" />
            <Button variant="outline" className="mt-4 h-12" onClick={() => setPhoto(null)}>
              <RotateCcw className="w-5 h-5 mr-2" /> Retake Photo
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4 justify-center">
            <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} 
              onChange={handleFileChange} className="hidden" />
            <input type="file" accept="image/*" ref={fileInputRef} 
              onChange={handleFileChange} className="hidden" />
            
            <Button onClick={() => cameraInputRef.current?.click()}
              className="h-20 text-xl font-bold bg-[#1A8B06] hover:bg-[#106203]">
              <Camera className="w-8 h-8 mr-3" /> Take Photo
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-16 text-lg">
              <Upload className="w-6 h-6 mr-2" /> Choose from Gallery
            </Button>
          </div>
        )}

        <div className="mt-4">
          <label className="text-sm font-medium text-white mb-2 block">Driver Notes (optional)</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Left at front door, customer signed, etc."
            className="bg-white h-24 text-base" />
        </div>
      </div>

      <div className="p-4 bg-white border-t">
        <Button onClick={handleSubmit} disabled={uploading}
          className="w-full h-16 text-xl font-bold bg-[#1A8B06] hover:bg-[#106203]">
          {uploading ? 'Uploading...' : <><Check className="w-6 h-6 mr-2" /> Confirm Delivery</>}
        </Button>
      </div>
    </div>
  );
}
