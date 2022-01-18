import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';



@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey:string = environment.API_KEY;
  private url :string = environment.URL;
  private _historial: string[] = [];
  public resultados: Gif[] =[];
  

  get historial():string[] {
  
    return [...this._historial];
  }


  constructor (
    private http: HttpClient
  ) {
      this.getLocalStorage();    
  }

  buscarGifs( query: string):void {

    query = query.trim().toLocaleLowerCase();

    if( !this._historial.includes(query)) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      this.setLocalStorage('historial', this._historial );
      
    }

    this.getGifs(query);
    

  }

  getGifs(termino:any) {
    const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', '10')
        .set('q', termino); 

    this.http.get<SearchGifsResponse>(`${this.url}/search`, {params})
        .subscribe( (resp) => {
          this.resultados = resp.data;
          this.setLocalStorage('resultado',this.resultados);
        })
  }

  setLocalStorage(key:string, value:Gif[] | String []) {
    localStorage.setItem(key, JSON.stringify(value));
    
  }
  getLocalStorage() {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

  }

  
}
